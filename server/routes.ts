import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { websocketMessageSchema, type WebSocketMessage, type User, type Message } from "@shared/schema";

interface WebSocketWithUserId extends WebSocket {
  userId?: string;
  roomId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });

  // Store active connections
  const connections = new Map<string, WebSocketWithUserId>();
  const typingUsers = new Set<string>();

  // Broadcast to all users in a room
  function broadcastToRoom(roomId: string, message: WebSocketMessage, excludeUserId?: string) {
    connections.forEach((ws, userId) => {
      if (ws.roomId === roomId && 
          ws.readyState === WebSocket.OPEN && 
          userId !== excludeUserId) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Broadcast to all connections
  function broadcastToAll(message: WebSocketMessage, excludeUserId?: string) {
    connections.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN && userId !== excludeUserId) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Set up message deletion callback
  storage.onMessageDeleted = (messageId: string) => {
    broadcastToAll({
      type: 'message_deleted',
      payload: { messageId }
    });
  };

  wss.on('connection', (ws: WebSocketWithUserId) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const rawMessage = JSON.parse(data.toString());
        
        // Handle different message types
        switch (rawMessage.type) {
          case 'join_room': {
            const { userId, roomId, user } = rawMessage.payload;
            
            // Store user if not exists
            let existingUser = await storage.getUser(userId);
            if (!existingUser) {
              existingUser = await storage.createUser(user);
            } else {
              // Update last seen
              await storage.updateUser(userId, { lastSeen: Date.now() });
            }
            
            // Add user to room
            await storage.addUserToRoom(roomId, userId);
            
            // Store connection info
            ws.userId = userId;
            ws.roomId = roomId;
            connections.set(userId, ws);
            
            // Broadcast user joined
            broadcastToRoom(roomId, {
              type: 'user_joined',
              payload: { user: existingUser },
              roomId,
              userId
            }, userId);
            
            // Send current room state to new user
            const room = await storage.getChatRoom(roomId);
            const messages = await storage.getMessagesByRoom(roomId);
            const roomUsers = await Promise.all(
              (room?.users || []).map(id => storage.getUser(id))
            );
            
            ws.send(JSON.stringify({
              type: 'room_state',
              payload: {
                room,
                messages,
                users: roomUsers.filter(Boolean)
              }
            }));
            break;
          }

          case 'send_message': {
            const { message } = rawMessage.payload;
            const savedMessage = await storage.createMessage(message);
            
            // Add message to room
            const room = await storage.getChatRoom(message.roomId || 'main');
            if (room) {
              room.messages.push(savedMessage.id);
            }
            
            // Broadcast new message
            broadcastToRoom(message.roomId || 'main', {
              type: 'new_message',
              payload: { message: savedMessage },
              roomId: message.roomId || 'main',
              userId: message.senderId
            });
            break;
          }

          case 'typing_start': {
            const { userId, roomId } = rawMessage.payload;
            if (!typingUsers.has(userId)) {
              typingUsers.add(userId);
              await storage.updateUser(userId, { isTyping: true });
              
              broadcastToRoom(roomId, {
                type: 'typing_start',
                payload: { userId },
                roomId,
                userId
              }, userId);
            }
            break;
          }

          case 'typing_stop': {
            const { userId, roomId } = rawMessage.payload;
            if (typingUsers.has(userId)) {
              typingUsers.delete(userId);
              await storage.updateUser(userId, { isTyping: false });
              
              broadcastToRoom(roomId, {
                type: 'typing_stop',
                payload: { userId },
                roomId,
                userId
              }, userId);
            }
            break;
          }

          case 'panic_mode': {
            const { userId } = rawMessage.payload;
            
            // Clear all user data
            await storage.clearAllUserData(userId);
            
            // Notify all users in rooms that panic mode was activated
            broadcastToAll({
              type: 'panic_mode_activated',
              payload: { userId },
              userId
            });
            
            // Close connection
            ws.close();
            break;
          }

          case 'message_expired': {
            const { messageId } = rawMessage.payload;
            await storage.deleteMessage(messageId);
            
            // Notify all users that message expired
            broadcastToAll({
              type: 'message_expired',
              payload: { messageId }
            });
            break;
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          payload: { message: 'Invalid message format' }
        }));
      }
    });

    ws.on('close', async () => {
      console.log('WebSocket connection closed');
      
      if (ws.userId) {
        // Remove from connections
        connections.delete(ws.userId);
        
        // Remove from typing users
        typingUsers.delete(ws.userId);
        
        // Remove from room
        if (ws.roomId) {
          await storage.removeUserFromRoom(ws.roomId, ws.userId);
          
          // Broadcast user left
          broadcastToRoom(ws.roomId, {
            type: 'user_left',
            payload: { userId: ws.userId },
            roomId: ws.roomId,
            userId: ws.userId
          });
        }
      }
    });
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  app.get('/api/rooms/:roomId/messages', async (req, res) => {
    try {
      const { roomId } = req.params;
      const messages = await storage.getMessagesByRoom(roomId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  return httpServer;
}

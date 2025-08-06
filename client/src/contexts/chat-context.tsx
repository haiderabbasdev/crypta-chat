import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEncryption } from "@/hooks/use-encryption";
import { type User, type Message } from "@shared/schema";

interface ChatContextType {
  user: User | null;
  messages: Message[];
  users: User[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  encryptionStatus: 'inactive' | 'active';
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  connectToChat: (username: string, roomId: string) => void;
  sendMessage: (content: string, expiresIn?: number) => void;
  sendFile: (file: File, expiresIn?: number) => void;
  sendVoiceNote: (audioBlob: Blob, expiresIn?: number) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [roomId, setRoomId] = useState<string>("");
  
  const { generateKeyPair, encryptMessage, decryptMessage } = useEncryption();
  
  const onMessage = useCallback(async (wsMessage: any) => {
    switch (wsMessage.type) {
      case 'room_state': {
        const { room, messages: roomMessages, users: roomUsers } = wsMessage.payload;
        setMessages(roomMessages);
        setUsers(roomUsers);
        break;
      }
      
      case 'new_message': {
        const { message } = wsMessage.payload;
        try {
          // Decrypt message if it's for us
          if (message.senderId !== user?.id) {
            const decryptedContent = await decryptMessage(message.encryptedContent);
            message.content = decryptedContent;
          }
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error('Failed to decrypt message:', error);
        }
        break;
      }
      
      case 'user_joined': {
        const { user: newUser } = wsMessage.payload;
        setUsers(prev => [...prev.filter(u => u.id !== newUser.id), newUser]);
        break;
      }
      
      case 'user_left': {
        const { userId } = wsMessage.payload;
        setUsers(prev => prev.filter(u => u.id !== userId));
        break;
      }
      
      case 'typing_start': {
        const { userId } = wsMessage.payload;
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isTyping: true } : u
        ));
        break;
      }
      
      case 'typing_stop': {
        const { userId } = wsMessage.payload;
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isTyping: false } : u
        ));
        break;
      }
      
      case 'message_deleted': {
        const { messageId } = wsMessage.payload;
        setMessages(prev => prev.filter(m => m.id !== messageId));
        break;
      }
      
      case 'panic_mode_activated': {
        // Handle panic mode from other users
        setMessages([]);
        break;
      }
    }
  }, [user?.id, decryptMessage]);
  
  const { 
    connectionStatus, 
    sendMessage: sendWsMessage 
  } = useWebSocket('/ws', onMessage);

  const connectToChat = useCallback(async (username: string, targetRoomId: string) => {
    try {
      const keyPair = await generateKeyPair();
      const publicKeyStr = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
      
      const newUser: Omit<User, 'id'> = {
        username,
        publicKey: JSON.stringify(publicKeyStr),
        isTyping: false,
        lastSeen: Date.now(),
      };
      
      const userId = crypto.randomUUID();
      const userWithId = { ...newUser, id: userId };
      setUser(userWithId);
      setRoomId(targetRoomId);
      
      // Join room
      sendWsMessage({
        type: 'join_room',
        payload: {
          userId: userId,
          roomId: targetRoomId,
          user: userWithId
        }
      });
    } catch (error) {
      console.error('Failed to connect to chat:', error);
    }
  }, [generateKeyPair, sendWsMessage]);

  const sendMessage = useCallback(async (content: string, expiresIn?: number) => {
    if (!user || !roomId) return;
    
    try {
      const encryptedContent = await encryptMessage(content);
      const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : undefined;
      
      const message: Omit<Message, 'id'> = {
        content,
        encryptedContent,
        senderId: user.id,
        senderName: user.username,
        timestamp: Date.now(),
        expiresAt,
        type: 'text'
      };
      
      sendWsMessage({
        type: 'send_message',
        payload: { message: { ...message, roomId } }
      });
      
      // Add to local messages immediately (optimistic update)
      setMessages(prev => [...prev, { ...message, id: crypto.randomUUID() }]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [user, roomId, encryptMessage, sendWsMessage]);

  const sendFile = useCallback(async (file: File, expiresIn?: number) => {
    if (!user || !roomId) return;
    
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get pure base64
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const encryptedContent = await encryptMessage(`File: ${file.name}`);
      const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : undefined;
      
      const message: Omit<Message, 'id'> = {
        content: `File: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`,
        encryptedContent,
        senderId: user.id,
        senderName: user.username,
        timestamp: Date.now(),
        expiresAt,
        type: 'file',
        metadata: { 
          filename: file.name, 
          fileSize: file.size, 
          fileType: file.type,
          fileData: base64
        }
      };
      
      sendWsMessage({
        type: 'send_message',
        payload: { message: { ...message, roomId } }
      });
      
      setMessages(prev => [...prev, { ...message, id: crypto.randomUUID() }]);
    } catch (error) {
      console.error('Failed to send file:', error);
    }
  }, [user, roomId, encryptMessage, sendWsMessage]);

  const sendVoiceNote = useCallback(async (audioBlob: Blob, expiresIn?: number) => {
    if (!user || !roomId) return;
    
    try {
      // Convert audio to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data URL prefix to get pure base64
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      const encryptedContent = await encryptMessage(`Voice message`);
      const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : undefined;
      
      const message: Omit<Message, 'id'> = {
        content: `Voice message (${Math.round(audioBlob.size / 1024)}KB)`,
        encryptedContent,
        senderId: user.id,
        senderName: user.username,
        timestamp: Date.now(),
        expiresAt,
        type: 'voice',
        metadata: {
          audioData: base64,
          duration: 0,
          fileSize: audioBlob.size
        }
      };
      
      sendWsMessage({
        type: 'send_message',
        payload: { message: { ...message, roomId } }
      });
      
      setMessages(prev => [...prev, { ...message, id: crypto.randomUUID() }]);
    } catch (error) {
      console.error('Failed to send voice note:', error);
    }
  }, [user, roomId, encryptMessage, sendWsMessage]);

  const startTyping = useCallback(() => {
    if (!user || !roomId) return;
    sendWsMessage({
      type: 'typing_start',
      payload: { userId: user.id, roomId }
    });
  }, [user, roomId, sendWsMessage]);

  const stopTyping = useCallback(() => {
    if (!user || !roomId) return;
    sendWsMessage({
      type: 'typing_stop',
      payload: { userId: user.id, roomId }
    });
  }, [user, roomId, sendWsMessage]);

  return (
    <ChatContext.Provider value={{
      user,
      messages,
      users,
      connectionStatus,
      encryptionStatus: connectionStatus === 'connected' ? 'active' : 'inactive',
      showSettings,
      setShowSettings,
      connectToChat,
      sendMessage,
      sendFile,
      sendVoiceNote,
      startTyping,
      stopTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

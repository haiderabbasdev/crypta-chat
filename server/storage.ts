import { type User, type Message, type ChatRoom } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Messages
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByRoom(roomId: string): Promise<Message[]>;
  createMessage(message: Omit<Message, "id">): Promise<Message>;
  deleteMessage(id: string, broadcastFn?: (id: string) => void): Promise<boolean>;
  deleteExpiredMessages(): Promise<number>;
  
  // Chat Rooms
  getChatRoom(id: string): Promise<ChatRoom | undefined>;
  createChatRoom(room: Omit<ChatRoom, "id">): Promise<ChatRoom>;
  addUserToRoom(roomId: string, userId: string): Promise<boolean>;
  removeUserFromRoom(roomId: string, userId: string): Promise<boolean>;
  
  // Panic mode
  clearAllUserData(userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private messages: Map<string, Message> = new Map();
  private chatRooms: Map<string, ChatRoom> = new Map();
  private messageExpirationTimers: Map<string, NodeJS.Timeout> = new Map();
  public onMessageDeleted?: (messageId: string) => void;

  constructor() {
    // Create default chat room
    const defaultRoom: ChatRoom = {
      id: "main",
      name: "Main Terminal",
      users: [],
      messages: [],
      createdAt: Date.now(),
    };
    this.chatRooms.set("main", defaultRoom);
    
    // Clean up expired messages every minute
    setInterval(() => {
      this.deleteExpiredMessages();
    }, 60000);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: Omit<User, "id">): Promise<User> {
    const id = randomUUID();
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    const room = this.chatRooms.get(roomId);
    if (!room) return [];
    
    return room.messages
      .map(msgId => this.messages.get(msgId))
      .filter((msg): msg is Message => msg !== undefined)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  async createMessage(message: Omit<Message, "id">): Promise<Message> {
    const id = randomUUID();
    const newMessage: Message = { ...message, id };
    this.messages.set(id, newMessage);
    
    // Set up expiration timer if message has expiration
    if (newMessage.expiresAt) {
      const timeUntilExpiration = newMessage.expiresAt - Date.now();
      if (timeUntilExpiration > 0) {
        const timer = setTimeout(() => {
          this.deleteMessage(id, this.onMessageDeleted);
        }, timeUntilExpiration);
        this.messageExpirationTimers.set(id, timer);
      }
    }
    
    return newMessage;
  }

  async deleteMessage(id: string, broadcastFn?: (id: string) => void): Promise<boolean> {
    const timer = this.messageExpirationTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.messageExpirationTimers.delete(id);
    }
    
    const deleted = this.messages.delete(id);
    
    // Remove from room message lists
    this.chatRooms.forEach((room) => {
      const index = room.messages.indexOf(id);
      if (index > -1) {
        room.messages.splice(index, 1);
      }
    });
    
    // Broadcast deletion if function provided
    if (deleted && broadcastFn) {
      broadcastFn(id);
    }
    
    return deleted;
  }

  async deleteExpiredMessages(): Promise<number> {
    const now = Date.now();
    let deletedCount = 0;
    
    // Convert to array to avoid iteration issues
    const messageEntries = Array.from(this.messages.entries());
    
    for (const [id, message] of messageEntries) {
      if (message.expiresAt && message.expiresAt <= now) {
        await this.deleteMessage(id);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }

  // Chat Rooms
  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    return this.chatRooms.get(id);
  }

  async createChatRoom(room: Omit<ChatRoom, "id">): Promise<ChatRoom> {
    const id = randomUUID();
    const newRoom: ChatRoom = { ...room, id };
    this.chatRooms.set(id, newRoom);
    return newRoom;
  }

  async addUserToRoom(roomId: string, userId: string): Promise<boolean> {
    const room = this.chatRooms.get(roomId);
    if (!room) return false;
    
    if (!room.users.includes(userId)) {
      room.users.push(userId);
    }
    return true;
  }

  async removeUserFromRoom(roomId: string, userId: string): Promise<boolean> {
    const room = this.chatRooms.get(roomId);
    if (!room) return false;
    
    room.users = room.users.filter(id => id !== userId);
    return true;
  }

  // Panic mode
  async clearAllUserData(userId: string): Promise<boolean> {
    // Remove user from all rooms
    for (const room of this.chatRooms.values()) {
      room.users = room.users.filter(id => id !== userId);
    }
    
    // Delete all messages from this user
    const messagesToDelete: string[] = [];
    for (const [id, message] of this.messages.entries()) {
      if (message.senderId === userId) {
        messagesToDelete.push(id);
      }
    }
    
    for (const msgId of messagesToDelete) {
      await this.deleteMessage(msgId);
    }
    
    // Delete user
    return this.users.delete(userId);
  }
}

export const storage = new MemStorage();

import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  encryptedContent: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  timestamp: z.number(),
  expiresAt: z.number().optional(),
  type: z.enum(["text", "file", "voice"]),
  metadata: z.record(z.any()).optional(),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  publicKey: z.string(),
  isTyping: z.boolean().default(false),
  lastSeen: z.number(),
});

export const chatRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  users: z.array(z.string()),
  messages: z.array(z.string()),
  createdAt: z.number(),
});

export const websocketMessageSchema = z.object({
  type: z.enum([
    "user_joined", 
    "user_left", 
    "new_message", 
    "typing_start", 
    "typing_stop", 
    "message_expired",
    "panic_mode_activated"
  ]),
  payload: z.any(),
  roomId: z.string().optional(),
  userId: z.string().optional(),
});

export type Message = z.infer<typeof messageSchema>;
export type User = z.infer<typeof userSchema>;
export type ChatRoom = z.infer<typeof chatRoomSchema>;
export type WebSocketMessage = z.infer<typeof websocketMessageSchema>;

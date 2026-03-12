/**
 * Internal Team Chat Types
 *
 * Types for the internal real-time chat between users of the same company.
 * Messages are stored in Redis with a 72-hour TTL (no MongoDB persistence).
 */

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export type TeamChatMessageType = 'text' | 'file' | 'audio' | 'image';

export interface TeamChatMessage {
  id: string;                   // UUID generated on client
  roomId: string;               // Deterministic room ID
  senderId: string;             // userId of sender
  senderName: string;           // Full name for display
  senderAvatar?: string;        // Avatar URL
  type: TeamChatMessageType;
  content?: string;             // For text messages
  mediaUrl?: string;            // S3 URL for file/audio/image
  mediaName?: string;           // Original file name
  mediaMimeType?: string;       // MIME type for rendering
  mediaSize?: number;           // File size in bytes
  readBy: string[];             // Array of userIds who have read this message
  createdAt: string;            // ISO timestamp
}

// ============================================================================
// USER PRESENCE
// ============================================================================

export type TeamUserStatus = 'online' | 'offline';

export interface TeamUserPresence {
  userId: string;
  status: TeamUserStatus;
  lastSeen?: string;            // ISO timestamp of last seen (when offline)
}

export interface TeamUserWithPresence {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

// ============================================================================
// CHAT ROOM
// ============================================================================

export interface TeamChatRoom {
  roomId: string;
  participants: string[];       // [userId1, userId2]
  lastMessage?: TeamChatMessage;
  unreadCount: number;          // Unread count for current user
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface TeamChatMessagesResponse {
  messages: TeamChatMessage[];
  roomId: string;
}

export interface TeamChatUploadResponse {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface TeamChatUsersResponse {
  users: TeamUserWithPresence[];
}

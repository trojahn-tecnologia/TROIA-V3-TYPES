/**
 * Internal Team Chat Types
 *
 * Types for the internal real-time chat between users of the same company.
 * Messages are stored in Redis with a 72-hour TTL (no MongoDB persistence).
 */
export type TeamChatMessageType = 'text' | 'file' | 'audio' | 'image';
export interface TeamChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    type: TeamChatMessageType;
    content?: string;
    mediaUrl?: string;
    mediaName?: string;
    mediaMimeType?: string;
    mediaSize?: number;
    readBy: string[];
    createdAt: string;
}
export type TeamUserStatus = 'online' | 'offline';
export interface TeamUserPresence {
    userId: string;
    status: TeamUserStatus;
    lastSeen?: string;
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
export interface TeamChatRoom {
    roomId: string;
    participants: string[];
    lastMessage?: TeamChatMessage;
    unreadCount: number;
}
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

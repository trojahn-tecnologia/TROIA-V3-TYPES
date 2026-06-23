import { ObjectId } from 'mongodb';
import type { TextContent, ImageContent, VideoContent, AudioContent, DocumentContent } from './conversation-messages';
/**
 * Quick Messages ("Mensagens Rápidas") — canned responses reusable in the chat.
 *
 * Each quick message is either *personal* (owned by a single user) or *company*
 * (shared with everyone in the company). It stores the exact same content shape
 * the chat sends (`QuickMessageContent`), so inserting/sending is a straight
 * pass-through to `POST /conversation-messages/send`.
 */
/**
 * Visibility scope of a quick message.
 * - `personal`: only the owner (`userId`) sees/manages it.
 * - `company`: every user in the company sees it; managing requires the
 *   `quick-messages` module permission.
 */
export type QuickMessageScope = 'personal' | 'company';
/**
 * Content a quick message can hold — restricted to the 4 chat modes
 * (text, attachment, text+attachment, audio). Reuses the canonical chat
 * content interfaces so the payload is identical when sent.
 */
export type QuickMessageContent = TextContent | ImageContent | VideoContent | AudioContent | DocumentContent;
/**
 * Main Quick Message Document (MongoDB)
 */
export interface QuickMessage {
    _id?: ObjectId;
    appId: ObjectId;
    companyId: ObjectId;
    scope: QuickMessageScope;
    userId?: ObjectId;
    title: string;
    shortcut?: string;
    content: QuickMessageContent[];
    usageCount: number;
    lastUsedAt?: Date;
    createdBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * API Response Type (no ObjectId exposure)
 */
export interface QuickMessageResponse extends Omit<QuickMessage, '_id' | 'appId' | 'companyId' | 'userId' | 'createdBy'> {
    id: string;
    appId: string;
    companyId: string;
    userId?: string;
    createdBy: string;
}
/**
 * Create Quick Message Request
 */
export interface CreateQuickMessageRequest {
    scope: QuickMessageScope;
    title: string;
    shortcut?: string;
    content: QuickMessageContent[];
}
/**
 * Update Quick Message Request (scope is immutable after creation)
 */
export interface UpdateQuickMessageRequest {
    title?: string;
    shortcut?: string;
    content?: QuickMessageContent[];
}
/**
 * Quick Message Query Filters
 */
export interface QuickMessageQuery {
    scope?: QuickMessageScope;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'createdAt' | 'usageCount' | 'lastUsedAt';
    sortOrder?: 'asc' | 'desc';
}
/**
 * Quick Message List Response
 */
export interface QuickMessageListResponse {
    items: QuickMessageResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

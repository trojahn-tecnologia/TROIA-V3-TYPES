/**
 * Communication Types
 * Types for email, messaging, and webhook communications
 */
import { MediaData } from './gateway';
import { Contact } from './contacts';
import { Group } from './groups';
export interface EmailData {
    to: string | string[];
    from?: string;
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    html?: string;
    text?: string;
    attachments?: EmailAttachment[];
}
export interface EmailAttachment {
    filename: string;
    content?: string | ArrayBuffer;
    path?: string;
    contentType?: string;
    encoding?: string;
}
export interface MessageData {
    contact?: Contact;
    group?: Group;
    message?: string;
    messageId?: string;
    replyToMessageId?: string;
    type?: 'text' | 'media' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact' | 'contacts' | 'reaction';
    media?: MediaData;
    /** @deprecated Use media.url instead */
    mediaUrl?: string;
    /** @deprecated Use media.type instead */
    mediaType?: 'image' | 'video' | 'audio' | 'document' | 'sticker';
    /** @deprecated Use media.filename instead */
    filename?: string;
    location?: {
        latitude: number;
        longitude: number;
        name?: string;
        address?: string;
    };
    contactData?: {
        name: string;
        phone?: string;
        email?: string;
        vcard?: string;
    };
    reaction?: {
        emoji: string;
        targetMessageId: string;
        fromMe?: boolean;
    };
    interactiveData?: Record<string, unknown>;
}
export interface WebhookData {
    url: string;
    method?: 'POST' | 'PUT' | 'PATCH';
    headers?: Record<string, string>;
    body: unknown;
    timeout?: number;
}
/**
 * Template Message Data
 * Used for sending template messages in campaigns
 * Supports both WhatsApp Business API (requires approval) and Gateway (no approval needed)
 */
export interface TemplateMessageData {
    recipientIdentifier: string;
    recipientName?: string;
    templateName: string;
    language?: string;
    variables: Record<string, string>;
    components?: Array<{
        type: 'header' | 'body' | 'footer' | 'button';
        parameters?: Array<{
            type: 'text' | 'image' | 'video' | 'document' | 'location';
            text?: string;
            image?: {
                link: string;
            };
            video?: {
                link: string;
            };
            document?: {
                link: string;
                filename?: string;
            };
            location?: {
                latitude: number;
                longitude: number;
                name?: string;
                address?: string;
            };
        }>;
        sub_type?: 'url' | 'quick_reply';
        index?: number;
    }>;
    renderedContent?: string;
    messageId?: string;
    headerMedia?: {
        type: 'image' | 'video' | 'document' | 'audio';
        url: string;
        filename?: string;
    };
    location?: {
        latitude: number;
        longitude: number;
        name?: string;
        address?: string;
    };
    contactData?: {
        name: string;
        phone?: string;
        email?: string;
    };
}
/**
 * Result of sending a template message
 */
export interface SendTemplateResult {
    success: boolean;
    providerMessageId?: string;
    error?: string;
}

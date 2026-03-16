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
  // ✅ Full objects for provider to extract identifiers
  contact?: Contact;  // Full contact object - provider extracts identifiers[0]
  group?: Group;      // Full group object - provider uses providerGroupId

  message?: string;
  messageId?: string;  // ✅ MongoDB message ID for correlation
  replyToMessageId?: string;  // ✅ ID of message being replied to (for quoted messages)
  type?: 'text' | 'media' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact' | 'contacts' | 'reaction';

  // ✅ Structured media object
  media?: MediaData;

  // Legacy fields for backward compatibility (deprecated - use media object instead)
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

  // ✅ Contact data for sending vCard (not the recipient!)
  contactData?: {
    name: string;
    phone?: string;
    email?: string;
    vcard?: string;
  };

  reaction?: {
    emoji: string;
    targetMessageId: string;
  };

  // Interactive message data (buttons, list, template)
  interactiveData?: Record<string, unknown>;
}

export interface WebhookData {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  body: any;
  timeout?: number;
}

/**
 * Template Message Data
 * Used for sending template messages in campaigns
 * Supports both WhatsApp Business API (requires approval) and Gateway (no approval needed)
 */
export interface TemplateMessageData {
  // Recipient info
  recipientPhone: string;
  recipientName?: string;

  // Template info
  templateName: string;           // providerTemplateId for WhatsApp Business, template name for Gateway
  language?: string;              // 'pt_BR', 'en_US', etc. (default: 'pt_BR')

  // Variables already resolved (position -> value)
  variables: Record<string, string>;  // { "1": "João", "2": "Empresa XYZ" }

  // Template components (WhatsApp Business API format)
  components?: Array<{
    type: 'header' | 'body' | 'footer' | 'button';
    parameters?: Array<{
      type: 'text' | 'image' | 'video' | 'document';
      text?: string;
      image?: { link: string };
      video?: { link: string };
      document?: { link: string; filename?: string };
    }>;
    sub_type?: 'url' | 'quick_reply';
    index?: number;
  }>;

  // For Gateway: pre-rendered content (variables already replaced)
  renderedContent?: string;

  // Message ID for correlation (campaign message tracking)
  messageId?: string;

  // For media templates
  headerMedia?: {
    type: 'image' | 'video' | 'document';
    url: string;
    filename?: string;
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


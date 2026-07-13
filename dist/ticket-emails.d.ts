import { AppAwareDocument } from './common';
export type TicketEmailDirection = 'inbound' | 'outbound';
export interface TicketEmailAttachment {
    url: string;
    filename: string;
    size?: number;
    mimeType?: string;
}
export interface TicketEmail extends AppAwareDocument {
    ticketId: string;
    channelId: string;
    contactId?: string;
    direction: TicketEmailDirection;
    from: string;
    to: string[];
    cc?: string[];
    subject?: string;
    html?: string;
    plainText?: string;
    attachments?: TicketEmailAttachment[];
    rfcMessageId?: string;
    inReplyTo?: string;
    references?: string[];
    providerMessageId?: string;
    deliveryStatus?: string;
    isAutoReply?: boolean;
    actorId?: string;
    sentAt: Date;
}
export interface TicketEmailResponse extends Omit<TicketEmail, '_id' | 'appId'> {
    id: string;
    appId: string;
}

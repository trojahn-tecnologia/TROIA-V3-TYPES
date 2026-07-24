import { AppAwareDocument, PaginationQuery, ListResponse } from './common';
import { TicketEmailAttachment } from './ticket-emails';
export type EmailRetentionStatus = 'pending' | 'approved' | 'blocked' | 'discarded';
export interface EmailRetentionPayload {
    to: string[];
    cc?: string[];
    html?: string;
    plainText?: string;
    attachments: TicketEmailAttachment[];
    rfcMessageId?: string;
    inReplyTo?: string;
    references?: string[];
    receivedAt: Date;
}
export interface EmailRetention extends AppAwareDocument {
    channelId: string;
    contactId: string;
    from: string;
    subject?: string;
    snippet?: string;
    attachmentsCount: number;
    email: EmailRetentionPayload;
    status: EmailRetentionStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    ticketId?: string;
}
export interface EmailRetentionResponse extends Omit<EmailRetention, '_id' | 'appId'> {
    id: string;
    appId: string;
}
export interface EmailRetentionQuery extends PaginationQuery {
    status?: EmailRetentionStatus;
    channelId?: string;
}
export interface EmailRetentionListResponse extends ListResponse<EmailRetentionResponse> {
}

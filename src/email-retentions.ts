import { AppAwareDocument, PaginationQuery, ListResponse } from './common';
import { TicketEmailAttachment } from './ticket-emails';

// ============================================================================
// EMAIL RETENTIONS — Retenção de e-mails inbound antes de virarem ticket (Plano B)
// Spec: DOCS/superpowers/specs/2026-07-12-ticket-redesign-email-customers-design.md (§3, D5, D6, D10)
//
// AUTOCONTIDA — sem conversation/message. Usada quando o canal está em
// `ticketCreationMode: 'review'` ou quando o contato ainda não tem
// `emailTicketAuthorization` decidida (D5): o e-mail inbound fica retido
// até aprovação/bloqueio manual (tela de Retenção), e só então vira ticket.
// ============================================================================

// 'discarded' (2026-07-24): "Descartar" — limpa a entry sem criar ticket e sem
// tocar o contato (remetente segue indeciso → próximos e-mails ainda retidos).
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

  // Denormalizados p/ listagem (evita popular o payload inteiro na tela de Retenção)
  from: string;
  subject?: string;
  snippet?: string;
  attachmentsCount: number;

  email: EmailRetentionPayload; // e-mail completo

  status: EmailRetentionStatus;
  reviewedBy?: string;
  reviewedAt?: Date;

  ticketId?: string; // preenchido na aprovação
}

export interface EmailRetentionResponse extends Omit<EmailRetention, '_id' | 'appId'> {
  id: string;
  appId: string;
}

export interface EmailRetentionQuery extends PaginationQuery {
  status?: EmailRetentionStatus;
  channelId?: string;
}

export interface EmailRetentionListResponse extends ListResponse<EmailRetentionResponse> {}

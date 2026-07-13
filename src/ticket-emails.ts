import { AppAwareDocument } from './common';

// ============================================================================
// TICKET EMAILS — E-mails de um ticket "de e-mail" (Plano B)
// Spec: DOCS/superpowers/specs/2026-07-12-ticket-redesign-email-customers-design.md (§3, D4, D6, D10)
//
// Decisão arquitetural (dono, 2026-07-12): com ticketCreationMode 'review'/'auto',
// o inbound de e-mail NÃO cria conversation — vive inteiramente no domínio de
// tickets via esta collection (inbound/outbound, threading RFC, envio via seam
// do provider Resend). Vínculo com o ticket é `Ticket.emailChannelId`
// (NUNCA `Ticket.conversationId`).
// ============================================================================

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

  // Threading RFC 5322 — usado para reply na mesma thread e para dedup/correlação
  rfcMessageId?: string; // Message-ID RFC do e-mail
  inReplyTo?: string;
  references?: string[];

  providerMessageId?: string; // id do Resend (outbound)
  deliveryStatus?: string;    // outbound (sent/delivered/bounced — eventos do Resend, best-effort)

  isAutoReply?: boolean;
  actorId?: string; // outbound: user que respondeu (ausente em auto-reply)

  sentAt: Date;
}

export interface TicketEmailResponse extends Omit<TicketEmail, '_id' | 'appId'> {
  id: string;
  appId: string;
}

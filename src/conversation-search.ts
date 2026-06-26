import type { ConversationMessage } from './conversation-messages';

export interface ConversationSemanticSearchRequest {
  query: string;
  contactId?: string;
  channelId?: string;
  dateFrom?: string; // ISO 8601
  dateTo?: string; // ISO 8601
  limit?: number; // nº de conversas (default 5, max 20)
  windowSize?: number; // msgs antes E depois de cada hit (default 15, max 50)
}

export interface ConversationMatch {
  messageId: string;
  sentAt: string;
  snippet: string;
  score: number;
}

/** Item da janela de contexto: mensagem completa + flag de acerto. */
export type ConversationContextMessage = ConversationMessage & {
  id: string;
  isMatch: boolean;
};

export interface ConversationSemanticSearchResult {
  conversationId: string;
  score: number;
  contact: { id: string; name: string } | null;
  channel: { id: string; name: string; type: string } | null;
  status: string;
  startedAt: string | null;
  lastMessageAt: string | null;
  matches: ConversationMatch[];
  contextWindow: ConversationContextMessage[];
}

export interface ConversationSemanticSearchResponse {
  results: ConversationSemanticSearchResult[];
  total: number;
}

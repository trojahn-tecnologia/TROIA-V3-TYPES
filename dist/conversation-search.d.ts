import type { ConversationMessage } from './conversation-messages';
export interface ConversationSemanticSearchRequest {
    query: string;
    contactId?: string;
    channelId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    windowSize?: number;
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
    contact: {
        id: string;
        name: string;
    } | null;
    channel: {
        id: string;
        name: string;
        type: string;
    } | null;
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

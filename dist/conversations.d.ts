export interface ConversationPrivacy {
    enabled: boolean;
    users: string[];
}
/**
 * Quem enviou a última fala da conversa (desnormalizado de
 * `ConversationMessage.senderType`). `'system'` está deliberadamente fora:
 * mensagens system não atualizam `lastMessage*` (não são fala da conversa).
 */
export type ConversationLastMessageSenderType = 'contact' | 'user' | 'ai' | 'automation' | 'automation-follow';
/**
 * Estado da janela de mensageria da Meta para a conversa.
 *
 * Presente APENAS quando o canal é Meta oficial (whatsapp-business,
 * instagram-messaging, facebook-messenger). Ausente = a política não se aplica.
 *
 * Derivado na leitura a partir de `lastMessageFromCustomer` — não é persistido.
 */
export interface MessagingWindow {
    isOpen: boolean;
    /**
     * ISO. lastMessageFromCustomer + 24h.
     * Ausente ⟺ o cliente nunca escreveu — nesse caso `isOpen` é sempre false,
     * porque não existe janela a expirar.
     */
    expiresAt?: string;
    /** O que reabre a conversa neste canal. Instagram/Messenger não têm template. */
    reopenWith: 'template' | 'customer_only';
}
/**
 * Prioridade de uma conversa. ATENÇÃO: o enum de conversas usa `'normal'`,
 * NÃO `'medium'` — difere de leads e tickets (ver `kanban-sort.ts` do módulo
 * conversations, que já documenta a divergência no peso de ordenação).
 */
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';
export interface Conversation {
    id: string;
    appId: string;
    companyId: string;
    subject?: string;
    status: 'waiting' | 'active' | 'closed';
    priority: ConversationPriority;
    closeReason?: 'resolved' | 'spam' | 'duplicate' | 'no_response' | 'transferred' | 'expired' | 'other';
    closeNotes?: string;
    isReturn?: boolean;
    channelId: string;
    conversationType?: 'individual' | 'group';
    providerConversationId?: string;
    source: string;
    customerId?: string;
    userId?: string;
    contactId?: string;
    groupId?: string;
    contact?: {
        id: string;
        name: string;
        picture?: string;
        phone?: string;
        tags?: string[];
    };
    group?: {
        id: string;
        name: string;
        picture?: string;
    };
    members?: Array<{
        id: string;
        name: string;
        picture?: string;
        phone?: string;
        role: 'admin' | 'member';
        joinedAt: string;
    }>;
    leadId?: string;
    ticketId?: string;
    assigneeId?: string;
    assignee?: {
        id: string;
        name: string;
        picture?: string;
    };
    teamId?: string;
    assignmentType?: string;
    assignedAt?: string;
    assignedBy?: string;
    agentId?: string;
    agentStatus?: 'active' | 'inactive' | 'paused';
    provider?: {
        id: string;
        name: string;
        type: string;
        logo?: string;
    };
    messageCount: number;
    lastMessage?: string;
    lastMessageAt?: string;
    /**
     * Direção da ÚLTIMA fala da conversa — desnormalizada junto com
     * `lastMessage`/`lastMessageAt` (Tarefa 14). `'inbound'` = o cliente falou por
     * último (nós devemos resposta); `'outbound'` = nós falamos por último.
     *
     * Mensagem interna (`isInternal: true`) NÃO atualiza este campo, pelo mesmo
     * motivo que não atualiza a prévia: nota interna e registro de transferência
     * não são fala da conversa.
     *
     * Ausente em conversas antigas fora da janela da migration
     * `2026-07-27-002-backfill-conversation-last-message-direction` — o card
     * simplesmente não mostra o indicador de direção nesse caso, e o campo passa
     * a existir na próxima mensagem real.
     */
    lastMessageDirection?: 'inbound' | 'outbound';
    /**
     * Quem enviou a ÚLTIMA fala da conversa — desnormalizado junto com
     * `lastMessage`/`lastMessageAt`/`lastMessageDirection` (2026-08-04); os
     * quatro descrevem a MESMA mensagem e nunca podem divergir.
     *
     * Mensagem interna (`isInternal: true`) e mensagem `senderType: 'system'`
     * NÃO atualizam este campo (nem os irmãos): nota interna, registro de
     * transferência e injeções de contexto para o agente (webhook/skill) não são
     * fala da conversa — por isso `'system'` está fora do union.
     *
     * Consumido pelos filtros de trigger de workflow ("Quem enviou a última
     * mensagem" — inatividade/data via query Mongo, evento via contexto).
     * Ausente em conversas antigas fora da janela da migration de backfill
     * `2026-08-04-001-backfill-conversation-last-message-sender-type`.
     */
    lastMessageSenderType?: ConversationLastMessageSenderType;
    lastMessageFromCustomer?: string;
    /**
     * ✅ Computed (not stored in database) — só em canais Meta oficiais.
     *
     * ⚠️ Populado apenas nas leituras cujo pipeline hidrata `provider` via
     * aggregation — na prática, qualquer método do repository que passa por
     * `enrichConversations` (privado) ou pelo pipeline próprio de `findById`.
     * Exemplos atuais — lista ilustrativa, não fechada; cresce a cada endpoint
     * novo que reaproveite um desses dois caminhos — inclui `GET /conversations`,
     * `GET /conversations/:id`, `GET /conversations/history`,
     * `GET /conversations/history/:contactId/:channelId`,
     * `GET /conversations/kanban` e `GET /conversations/kanban/column`.
     *
     * Ausente nas respostas de mutação que devolvem o doc bruto do Mongo sem
     * reidratar `provider` — ex.: `PUT /conversations/:id` (usa `findOneAndUpdate`
     * direto). Não usar essas respostas para decidir o estado do composer.
     */
    messagingWindow?: MessagingWindow;
    firstResponseTime?: number;
    averageResponseTime?: number;
    tags: string[];
    category?: string;
    privacy?: ConversationPrivacy;
    muted?: boolean;
    userRole?: 'viewer' | 'attendant';
    metadata?: Record<string, unknown>;
    unreadTracking?: {
        [userId: string]: {
            count: number;
            lastResetAt: string;
            autoResetOnOpen: boolean;
        };
    };
    startedAt: string;
    endedAt?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateConversationRequest {
    subject?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    status?: 'waiting' | 'active' | 'closed';
    channelId: string;
    conversationType?: 'individual' | 'group';
    providerConversationId?: string;
    source: string;
    customerId?: string;
    contactId?: string;
    groupId?: string;
    leadId?: string;
    ticketId?: string;
    assigneeId?: string;
    teamId?: string;
    agentId?: string;
    agentStatus?: 'active' | 'inactive' | 'paused';
    tags?: string[];
    category?: string;
    privacy?: ConversationPrivacy;
    metadata?: Record<string, unknown>;
    /** Template oficial a enviar ao iniciar a conversa (canais whatsapp-business). */
    templateId?: string;
    /** Valores das variáveis do template, por posição: { "1": "João", "2": "ACME" }. */
    templateVariables?: Record<string, string>;
}
export interface UpdateConversationRequest {
    subject?: string;
    status?: 'waiting' | 'active' | 'closed';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    conversationType?: 'individual' | 'group';
    closeReason?: 'resolved' | 'spam' | 'duplicate' | 'no_response' | 'transferred' | 'expired' | 'other';
    closeNotes?: string;
    customerId?: string;
    contactId?: string;
    groupId?: string;
    leadId?: string;
    ticketId?: string;
    assigneeId?: string;
    teamId?: string;
    agentId?: string;
    agentStatus?: 'active' | 'inactive' | 'paused';
    tags?: string[];
    category?: string;
    privacy?: ConversationPrivacy;
    metadata?: Record<string, unknown>;
}
export type ConversationResponse = Conversation;
export interface ConversationQuery extends PaginationQuery {
    filters?: {
        search?: string;
        subject?: string;
        status?: 'waiting' | 'active' | 'closed' | Array<'waiting' | 'active' | 'closed'>;
        priority?: 'low' | 'normal' | 'high' | 'urgent';
        channelId?: string | string[];
        channelIds?: string[];
        _accessFilter?: Record<string, unknown>;
        channelType?: 'whatsapp' | 'instagram' | 'email' | 'chat' | 'sms' | 'telegram' | 'facebook' | 'widget';
        conversationType?: 'individual' | 'group' | 'ai';
        providerId?: string;
        source?: string;
        excludeSource?: string;
        customerId?: string;
        contactId?: string;
        leadId?: string;
        ticketId?: string;
        groupId?: string;
        assigneeId?: string | string[];
        teamId?: string;
        category?: string;
        tags?: string[];
        stepId?: string[];
        contactCustomerId?: string[];
        conversationTags?: string[];
        excludeConversationTags?: string[];
        hasUnreadMessages?: boolean;
        createdFrom?: string;
        createdTo?: string;
        lastMessageFrom?: string;
        lastMessageTo?: string;
    };
}
export interface ConversationListResponse extends ListResponse<ConversationResponse> {
}
/** Linha do histórico agrupado: a conversa fechada mais recente do par (contato, canal) + contagem */
export interface ConversationHistoryGroupResponse extends ConversationResponse {
    conversationCount: number;
}
export interface ConversationHistoryGroupListResponse extends ListResponse<ConversationHistoryGroupResponse> {
}
export type ConversationMediaType = 'image' | 'video' | 'audio' | 'document';
export interface ConversationMediaItem {
    messageId: string;
    type: ConversationMediaType;
    url: string;
    caption?: string;
    filename?: string;
    thumbnailUrl?: string;
    size?: number;
    mimeType?: string;
    sentAt: string;
}
export interface ConversationMediaCounts {
    total: number;
    image: number;
    video: number;
    audio: number;
    document: number;
}
export interface ConversationMediaQuery extends PaginationQuery {
    type?: ConversationMediaType;
}
export interface ConversationMediaListResponse {
    items: ConversationMediaItem[];
    total: number;
    page: number;
    limit: number;
    counts: ConversationMediaCounts;
}
export interface AssignConversationRequest {
    assigneeId?: string;
    teamId?: string;
    assignmentType?: string;
}
export interface TransferConversationRequest {
    fromAssigneeId?: string;
    toAssigneeId?: string;
    fromTeamId?: string;
    toTeamId?: string;
    reason?: string;
    notes?: string;
}
export interface CloseConversationRequest {
    reason?: string;
    notes?: string;
    rating?: number;
}
export interface ConversationStats {
    total: number;
    byStatus: Record<string, number>;
    byChannel: Record<string, number>;
    byPriority: Record<string, number>;
    averageResponseTime: number;
    totalUnread: number;
}
export interface BulkConversationOperationRequest {
    conversationIds: string[];
    operation: 'assign' | 'transfer' | 'close' | 'addTag' | 'removeTag' | 'changeStatus' | 'changePriority';
    data?: {
        assigneeId?: string;
        teamId?: string;
        status?: 'waiting' | 'active' | 'closed';
        priority?: 'low' | 'normal' | 'high' | 'urgent';
        tag?: string;
        reason?: string;
        notes?: string;
    };
}
/** Projeção enxuta da conversa para o card do kanban (SP4) — só o que os cards de Atendimento renderizam. */
export interface ConversationKanbanCard {
    id: string;
    status: 'waiting' | 'active' | 'closed';
    subject?: string;
    source?: string;
    agentId?: string;
    agentStatus?: 'active' | 'inactive' | 'paused';
    assigneeId?: string;
    closeReason?: 'resolved' | 'spam' | 'duplicate' | 'no_response' | 'transferred' | 'expired' | 'other';
    lastMessage?: string;
    lastMessageAt?: string;
    /** Quem falou por último. Alimenta os cards Normal (01) e Compacto (06). */
    lastMessageDirection?: 'inbound' | 'outbound';
    /** Persistida na conversa (default 'normal'); o board JÁ ordena por ela (sortMode 'priority'). */
    priority?: ConversationPriority;
    /** Tags da CONVERSA. Omitido quando vazio. */
    tags?: string[];
    /** Tags do CONTATO (hidratadas via `enrichConversations`). Omitido quando vazio. */
    contactTags?: string[];
    /** Nome do canal (não do provider). O ícone/cor de marca continua vindo de `providerType`. */
    channelName?: string;
    /**
     * Início do ATENDIMENTO (status → 'active'). Ausente enquanto a conversa está
     * em fila — NÃO cai para `createdAt` (diferente do `ConversationResponse.startedAt`,
     * que é obrigatório no tipo e por isso coalesce). Tempo em fila = startedAt − createdAt.
     */
    startedAt?: string;
    /** Computado server-side a partir de `unreadTracking[userId]` (campo é por-usuário). */
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
    contact?: {
        id: string;
        name: string;
        picture?: string;
        phone?: string;
    };
    assignee?: {
        id: string;
        name: string;
        picture?: string;
    };
    /** Derivado da hidratação channel→integration (mesma que `enrichConversations` já faz). */
    providerType?: string;
}
/** Query do board de atendimentos (GET /conversations/kanban). */
export interface ConversationKanbanQuery {
    search?: string;
    /** Tamanho da janela por coluna (default 50, máx 100 — validado no backend). */
    windowSize?: number;
    /** Modo de ordenação (default 'created'). Whitelist em CONVERSATION_KANBAN_SORT_MODES. Import de './kanban'. */
    sortMode?: KanbanSortMode;
    /** Subset de ConversationQuery.filters — status NÃO existe aqui (é a raia). */
    filters?: {
        channelId?: string;
        assigneeId?: string;
        teamId?: string;
        providerId?: string;
    };
}
/** Página de UMA coluna (lane) do kanban de atendimentos — extende o board com laneId + cursor. */
export interface ConversationKanbanColumnQuery extends ConversationKanbanQuery {
    laneId: ConversationKanbanLaneId;
    cursor?: string;
}
import { PaginationQuery, ListResponse } from './common';
import type { KanbanSortMode, ConversationKanbanLaneId } from './kanban';

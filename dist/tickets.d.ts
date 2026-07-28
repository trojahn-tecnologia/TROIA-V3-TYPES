import { TicketStatusCategory } from './ticket-pipelines';
import { ActivityAttachment } from './activities';
import type { KanbanSortMode } from './kanban';
export interface Ticket {
    id: string;
    appId: string;
    companyId: string;
    ticketNumber: string;
    title: string;
    description?: string;
    status: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    tags: string[];
    pipelineId: string;
    stageId: string;
    statusCategory: TicketStatusCategory;
    customerId?: string;
    contactId?: string;
    leadId?: string;
    projectId?: string;
    assigneeId?: string;
    teamId?: string;
    assignmentType?: string;
    assignedAt?: string;
    assignedBy?: string;
    slaBreachTime?: string;
    slaBreached?: boolean;
    responseTime?: number;
    resolutionTime?: number;
    conversationId?: string;
    channelId?: string;
    source?: string;
    emailChannelId?: string;
    firstResponseAt?: string;
    lastResponseAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    dueDate?: string;
    /**
     * ISO string do valor de `dueDate` para o qual já foi enviado o
     * alerta de vencimento (24h antes). Usado para idempotência: se o
     * `dueDate` for editado, este campo fica diferente do novo valor e o
     * ticket volta a ser elegível para alerta. Campo interno — não aceito
     * em CreateTicketRequest/UpdateTicketRequest.
     */
    dueDateAlertSentFor?: string;
    internalNotes?: string;
    resolutionSummary?: string;
    customerSatisfaction?: number;
    createdAt: string;
    updatedAt: string;
    /** Timestamp de entrada na etapa atual — usado pelo sortMode 'stepEntered' do kanban (SP3). */
    stageEnteredAt?: string;
    /** Timestamp da última atividade registrada no ticket — usado pelo sortMode 'inactivity' do kanban (SP3). */
    lastActivityAt?: string;
    /** Rank fractional do modo de ordenação manual do kanban (SP3). Ausente = nunca ordenado manualmente. */
    kanbanRank?: string;
}
export interface CreateTicketRequest {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    tags?: string[];
    pipelineId?: string;
    stageId?: string;
    customerId?: string;
    contactId?: string;
    leadId?: string;
    assigneeId?: string;
    teamId?: string;
    conversationId?: string;
    channelId?: string;
    source?: string;
    dueDate?: string;
    internalNotes?: string;
}
export interface UpdateTicketRequest {
    title?: string;
    description?: string;
    status?: string;
    statusReason?: string;
    resolution?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    tags?: string[];
    stageId?: string;
    customerId?: string;
    contactId?: string;
    leadId?: string;
    assigneeId?: string;
    teamId?: string;
    dueDate?: string;
    internalNotes?: string;
    resolutionSummary?: string;
    customerSatisfaction?: number;
    /** Rank fractional do modo de ordenação manual do kanban (SP3) — setado via drag no board. */
    kanbanRank?: string;
}
export type TicketResponse = Ticket;
export interface TicketQuery extends PaginationQuery {
    filters?: {
        title?: string;
        status?: string;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
        category?: string;
        tags?: string[];
        pipelineId?: string;
        stageId?: string;
        statusCategory?: TicketStatusCategory;
        customerId?: string;
        contactId?: string;
        leadId?: string;
        assigneeId?: string;
        teamId?: string;
        channelId?: string;
        source?: string;
        slaBreached?: boolean;
        createdFrom?: string;
        createdTo?: string;
        dueFrom?: string;
        dueTo?: string;
        resolvedFrom?: string;
        resolvedTo?: string;
    };
}
export interface TicketListResponse extends ListResponse<TicketResponse> {
}
export interface AssignTicketRequest {
    assigneeId?: string;
    teamId?: string;
    assignmentType?: string;
    reason?: string;
}
export interface ResolveTicketRequest {
    resolutionSummary: string;
    internalNotes?: string;
    customerSatisfaction?: number;
}
export interface TicketSLA {
    ticketId: string;
    responseTimeSLA: number;
    resolutionTimeSLA: number;
    breachTime: string;
    breached: boolean;
    actualResponseTime?: number;
    actualResolutionTime?: number;
}
export type TicketTimelineKind = 'activity' | 'email';
export interface TicketTimelineItem {
    kind: TicketTimelineKind;
    id: string;
    createdAt: string;
    activityType?: string;
    content?: string;
    contentFormat?: 'html' | 'text';
    isInternal?: boolean;
    attachments?: ActivityAttachment[];
    actor?: {
        id?: string;
        name: string;
        type: 'user' | 'contact' | 'system';
    };
    metadata?: Record<string, unknown>;
    direction?: 'inbound' | 'outbound';
    emailHtml?: string;
    emailMeta?: {
        from?: string;
        to?: string[];
        cc?: string[];
        subject?: string;
        deliveryStatus?: string;
    };
}
export interface TicketTimelineResponse {
    items: TicketTimelineItem[];
    nextCursor?: string;
    hasMore: boolean;
}
export interface ReplyTicketRequest {
    content: string;
    attachments?: ActivityAttachment[];
}
export interface TicketExportQuery {
    pipelineId?: string;
    stageId?: string;
    assigneeId?: string;
    assigneeIds?: string[];
    teamId?: string;
    status?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    tags?: string[];
    slaBreached?: boolean;
    channelId?: string;
    contactId?: string;
    customerId?: string;
    createdFrom?: string;
    createdTo?: string;
    dueFrom?: string;
    dueTo?: string;
    resolvedFrom?: string;
    resolvedTo?: string;
    search?: string;
}
import { PaginationQuery, ListResponse } from './common';
/** Projeção enxuta do ticket para o card do kanban (SP3) — só o que o TicketCard renderiza. */
export interface TicketKanbanCard {
    id: string;
    stageId: string;
    pipelineId: string;
    ticketNumber: string;
    title: string;
    description?: string;
    priority: string;
    statusCategory: string;
    category?: string;
    tags: string[];
    slaBreached?: boolean;
    slaDueAt?: string;
    projectId?: string;
    kanbanRank?: string;
    createdAt: string;
    updatedAt: string;
    /**
     * Entrada na etapa atual — gravado na criação (`preprocessCreate`) e a cada
     * movimentação de stage (`TicketsService.update`). O mapper do card já resolve
     * o legado sem o campo com queda para `createdAt`, o MESMO fallback do
     * sortMode 'stepEntered' (`$ifNull: [stageEnteredAt, createdAt]`), então aqui
     * o valor está sempre preenchido quando o ticket tem etapa.
     */
    stageEnteredAt?: string;
    contact?: {
        id: string;
        name: string;
        picture?: string;
    };
    assignee?: {
        id: string;
        name: string;
        picture?: string;
    };
}
/** Query do board de tickets (GET /tickets/kanban). */
export interface TicketKanbanQuery {
    pipelineId: string;
    search?: string;
    /** Tamanho da janela por coluna (default 50, máx 100 — validado no backend). */
    windowSize?: number;
    /** Modo de ordenação (default 'created'). Import de './kanban'. */
    sortMode?: KanbanSortMode;
    /** TicketQuery.filters não tem tipo nomeado (inline) — sem base pra Omit. */
    filters?: Record<string, unknown>;
}

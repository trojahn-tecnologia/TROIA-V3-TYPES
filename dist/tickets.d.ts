import { TicketStatusCategory } from './ticket-pipelines';
import { ActivityAttachment } from './activities';
import type { KanbanSortMode } from './kanban';
import type { SlaState } from './sla';
/**
 * Prioridade do chamado. Extraída da união inline que estava repetida em 5
 * declarações deste arquivo — o motor de SLA precisa do nome para tipar
 * `SlaPriorityMatch` e `SlaPolicyScope.priorities` (contrato §1).
 * Ordem semântica (menor → maior urgência): low < medium < high < urgent.
 */
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export interface Ticket {
    id: string;
    appId: string;
    companyId: string;
    ticketNumber: string;
    title: string;
    description?: string;
    status: string;
    priority: TicketPriority;
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
    /** Fonte da verdade dos relógios (motor de SLA). Escrito só pelo backend. */
    sla?: SlaState;
    /** Espelho plano — menor prazo vivo. DERIVADO de `sla.clocks` (projectSlaMirror). */
    slaBreachTime?: string;
    /** Espelho plano — qualquer relógio violado. DERIVADO de `sla.clocks`. */
    slaBreached?: boolean;
    /** Alias de leitura de `slaBreachTime`, mesmo nome que o cartão do kanban usa. NÃO é campo persistido. */
    slaDueAt?: string;
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
    priority?: TicketPriority;
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
    priority?: TicketPriority;
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
        priority?: TicketPriority;
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
/**
 * `action` das atividades de trilha. `type` continua sendo `'status_change'`
 * (valor já existente em `ActivityType`); o `action` é o que a timeline do
 * chamado recebe como `activityType` (`tickets/timeline-service.ts` mapeia
 * `activity.action || activity.type`).
 */
export declare const TICKET_STATUS_CHANGE_ACTION = "status_changed";
/**
 * Fotografia ESTRUTURADA do estado de etapa/status do chamado, gravada em
 * `Activity.beforeData` e `Activity.afterData` da trilha.
 *
 * Estruturado, nunca prosa: o backfill de ativação do motor reconstrói tempo
 * pausado lendo `statusCategory` dos dois lados de cada transição. Sem esses
 * campos a trilha vira decoração de timeline e a Fase 0 não entrega o que
 * promete.
 *
 * `stageId` é opcional porque existe caminho legítimo de mudança só de
 * `status` (PUT sem `stageId`), e porque chamado legado pode não ter etapa.
 * `status` é o rótulo humano — no caminho normal é o NOME da etapa
 * (`TicketsService.create`/`update` gravam `status = stage.name`).
 */
export interface TicketStatusChangeSnapshot {
    stageId?: string;
    statusCategory: TicketStatusCategory;
    status: string;
}
/**
 * `Activity.metadata` da trilha. Só o que não cabe no snapshot e não pode ser
 * derivado dele. Fica FORA de `title`/`description`/`summary` de propósito:
 * `metadata` não entra no índice de texto de `activities`.
 */
export interface TicketStatusChangeMetadata {
    /** Nome da etapa de origem, quando resolvido. */
    fromStageName?: string;
    /** Nome da etapa de destino, quando resolvido. */
    toStageName?: string;
    /** Presentes só quando a transição TROCOU o pipeline (transferência). */
    fromPipelineId?: string;
    toPipelineId?: string;
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
    priority?: TicketPriority;
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

import { TicketStatusCategory } from './ticket-pipelines';
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

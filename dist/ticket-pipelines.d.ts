import { PaginationQuery, ListResponse, AppAwareDocument, ActiveStatus } from './common';
import type { DistributionConfig } from './distribution';
export type TicketStatusCategory = 'new' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type SLABehavior = 'running' | 'paused' | 'stopped';
export interface TicketStatusCategoryConfig {
    label: string;
    slaBehavior: SLABehavior;
    color: string;
}
export declare const TICKET_STATUS_CATEGORIES: Record<TicketStatusCategory, TicketStatusCategoryConfig>;
export interface TicketPipeline extends AppAwareDocument {
    name: string;
    description?: string;
    color: string;
    order: number;
    status: ActiveStatus;
    /**
     * Distribuição automática de tickets — config unificada (D8, D9).
     * Mesmo shape que `Funnel.assignmentConfig` e `Channel.assignmentConfig`.
     */
    assignmentConfig?: DistributionConfig;
    /**
     * Contador monotônico de rotação usado por `DistributionService`.
     * Incrementado atomicamente via `$inc` a cada atribuição.
     */
    lastAssignedUserId?: number;
}
export interface CreateTicketPipelineRequest {
    name: string;
    description?: string;
    color: string;
    order?: number;
    assignmentConfig?: DistributionConfig;
}
export interface UpdateTicketPipelineRequest {
    name?: string;
    description?: string;
    color?: string;
    order?: number;
    status?: ActiveStatus;
    assignmentConfig?: DistributionConfig;
}
export type TicketPipelineResponse = Omit<TicketPipeline, '_id'> & {
    id: string;
    /**
     * Scope do usuário logado neste pipeline (proveniente de `ticket-pipelines-users`).
     * Mesma semântica de `FunnelResponse.userScope`:
     * - `'own'` | `'team'` | `'all'`: user tem entry ativa com esse scope
     * - `null` ou ausente: D-context-gate inativo (sem entry)
     *
     * Frontend usa pra esconder/filtrar UI (filtro de operadores).
     */
    userScope?: 'own' | 'team' | 'all' | null;
};
export interface TicketPipelineQuery extends PaginationQuery {
    filters?: {
        status?: ActiveStatus;
        name?: string;
    };
}
export interface TicketPipelineListResponse extends ListResponse<TicketPipelineResponse> {
}
export interface ReorderTicketPipelinesRequest {
    pipelineIds: string[];
}
export interface TicketPipelineDeleteValidation {
    canDelete: boolean;
    linkedTicketsCount: number;
    message: string;
}
export interface TicketStage extends AppAwareDocument {
    pipelineId: string;
    name: string;
    description?: string;
    color: string;
    order: number;
    status: ActiveStatus;
    category: TicketStatusCategory;
    agentLabel?: string;
    customerLabel?: string;
    isDefault: boolean;
    isSystem: boolean;
}
export interface CreateTicketStageRequest {
    pipelineId: string;
    name: string;
    description?: string;
    color: string;
    order?: number;
    category: TicketStatusCategory;
    agentLabel?: string;
    customerLabel?: string;
    isDefault?: boolean;
    isSystem?: boolean;
}
export interface UpdateTicketStageRequest {
    name?: string;
    description?: string;
    color?: string;
    order?: number;
    status?: ActiveStatus;
    category?: TicketStatusCategory;
    agentLabel?: string;
    customerLabel?: string;
    isDefault?: boolean;
}
export type TicketStageResponse = Omit<TicketStage, '_id'> & {
    id: string;
};
export interface TicketStageQuery extends PaginationQuery {
    filters?: {
        pipelineId?: string;
        status?: ActiveStatus;
        category?: TicketStatusCategory;
        name?: string;
    };
}
export interface TicketStageListResponse extends ListResponse<TicketStageResponse> {
}
export interface ReorderTicketStagesRequest {
    stageIds: string[];
}
export interface TicketStageDeleteValidation {
    canDelete: boolean;
    linkedTicketsCount: number;
    message: string;
}

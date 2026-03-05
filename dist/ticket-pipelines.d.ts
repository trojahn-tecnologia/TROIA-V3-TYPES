import { PaginationQuery, ListResponse, AppAwareDocument, ActiveStatus } from './common';
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
}
export interface CreateTicketPipelineRequest {
    name: string;
    description?: string;
    color: string;
    order?: number;
}
export interface UpdateTicketPipelineRequest {
    name?: string;
    description?: string;
    color?: string;
    order?: number;
    status?: ActiveStatus;
}
export type TicketPipelineResponse = Omit<TicketPipeline, '_id'> & {
    id: string;
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

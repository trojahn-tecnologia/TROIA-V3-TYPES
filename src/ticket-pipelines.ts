import { PaginationQuery, ListResponse, AppAwareDocument, ActiveStatus } from './common';

// ============================================================================
// STATUS CATEGORIES (5 fixed values - controls SLA behavior)
// ============================================================================

export type TicketStatusCategory = 'new' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type SLABehavior = 'running' | 'paused' | 'stopped';

export interface TicketStatusCategoryConfig {
  label: string;
  slaBehavior: SLABehavior;
  color: string;
}

export const TICKET_STATUS_CATEGORIES: Record<TicketStatusCategory, TicketStatusCategoryConfig> = {
  new:         { label: 'Novo',         slaBehavior: 'running', color: '#3B82F6' },
  in_progress: { label: 'Em Andamento', slaBehavior: 'running', color: '#8B5CF6' },
  waiting:     { label: 'Aguardando',   slaBehavior: 'paused',  color: '#F59E0B' },
  resolved:    { label: 'Resolvido',    slaBehavior: 'stopped', color: '#10B981' },
  closed:      { label: 'Fechado',      slaBehavior: 'stopped', color: '#6B7280' },
};

// ============================================================================
// TICKET PIPELINE (Parent)
// ============================================================================

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

export type TicketPipelineResponse = Omit<TicketPipeline, '_id'> & { id: string };

export interface TicketPipelineQuery extends PaginationQuery {
  filters?: {
    status?: ActiveStatus;
    name?: string;
  };
}

export interface TicketPipelineListResponse extends ListResponse<TicketPipelineResponse> {}

export interface ReorderTicketPipelinesRequest {
  pipelineIds: string[];
}

export interface TicketPipelineDeleteValidation {
  canDelete: boolean;
  linkedTicketsCount: number;
  message: string;
}

// ============================================================================
// TICKET STAGE (Child - belongs to a pipeline)
// ============================================================================

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

export type TicketStageResponse = Omit<TicketStage, '_id'> & { id: string };

export interface TicketStageQuery extends PaginationQuery {
  filters?: {
    pipelineId?: string;
    status?: ActiveStatus;
    category?: TicketStatusCategory;
    name?: string;
  };
}

export interface TicketStageListResponse extends ListResponse<TicketStageResponse> {}

export interface ReorderTicketStagesRequest {
  stageIds: string[];
}

export interface TicketStageDeleteValidation {
  canDelete: boolean;
  linkedTicketsCount: number;
  message: string;
}

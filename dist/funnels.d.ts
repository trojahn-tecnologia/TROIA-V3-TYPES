import { PaginationQuery, ListResponse, AppAwareDocument, ActiveStatus } from './common';
import { AssignmentConfig as BaseAssignmentConfig, CoreLotteryConfig } from './assignment';
/**
 * Funnel assignment config extends base assignment config.
 * Usado para configurar como leads são atribuídos automaticamente.
 */
export interface FunnelAssignmentConfig extends BaseAssignmentConfig {
    /** Estratégia de assignment: manual, rule-based, lottery, shift_lottery, ou none */
    strategy: 'manual' | 'rule' | 'lottery' | 'shift_lottery' | 'none';
    /** Regras de assignment condicional */
    rules?: FunnelAssignmentRule[];
    /** Configuração de lottery (se strategy='lottery' ou 'shift_lottery') */
    lotteryConfig?: FunnelLotteryConfig;
}
export interface FunnelAssignmentRule {
    condition: FunnelRuleCondition;
    action: FunnelRuleAction;
    priority: number;
    active: boolean;
}
export interface FunnelRuleCondition {
    type: 'source' | 'value' | 'priority' | 'tags' | 'customField';
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
    value: string | number | string[];
}
export interface FunnelRuleAction {
    type: 'assign_to_user' | 'assign_to_team' | 'trigger_lottery';
    userId?: string;
    teamId?: string;
    lotteryConfig?: FunnelLotteryConfig;
}
/**
 * Funnel lottery config extends CoreLotteryConfig.
 * Usa a mesma estrutura unificada de channels.
 *
 * @see CoreLotteryConfig - Tipos base unificados
 */
export interface FunnelLotteryConfig extends CoreLotteryConfig {
    /** Escopo do lottery: apenas usuários, apenas equipes, ou ambos */
    scope?: 'team' | 'user' | 'both';
}
/**
 * Funnel - Sales funnel structure
 * Each funnel has its own independent steps
 */
export interface Funnel extends AppAwareDocument {
    name: string;
    description?: string;
    color: string;
    order: number;
    status: ActiveStatus;
    assignmentConfig?: FunnelAssignmentConfig;
    /** Round-robin tracking: ID do último usuário que recebeu atribuição neste funnel */
    lastAssignedUserId?: string;
    /** Permite criar leads duplicados (mesmo contactId) neste funil. Leads em funis diferentes não são afetados. Default: true */
    allowDuplicateContacts?: boolean;
    /** Tipos de lead disponíveis neste funil (ex: Venda, Suporte, Consultoria) */
    types?: string[];
}
export interface CreateFunnelRequest {
    name: string;
    description?: string;
    color: string;
    order?: number;
    assignmentConfig?: FunnelAssignmentConfig;
    /** Permite criar leads duplicados (mesmo contactId) neste funil. Leads em funis diferentes não são afetados. Default: true */
    allowDuplicateContacts?: boolean;
    /** Tipos de lead disponíveis neste funil */
    types?: string[];
}
export interface UpdateFunnelRequest {
    name?: string;
    description?: string;
    color?: string;
    order?: number;
    status?: ActiveStatus;
    assignmentConfig?: FunnelAssignmentConfig;
    /** Permite criar leads duplicados (mesmo contactId) neste funil. Leads em funis diferentes não são afetados. Default: true */
    allowDuplicateContacts?: boolean;
    /** Tipos de lead disponíveis neste funil */
    types?: string[];
}
export type FunnelResponse = Omit<Funnel, '_id'> & {
    id: string;
};
export interface FunnelQuery extends PaginationQuery {
    filters?: {
        status?: ActiveStatus;
        name?: string;
    };
}
export interface FunnelListResponse extends ListResponse<FunnelResponse> {
}
/**
 * FunnelStep - Individual stages within a funnel
 * Each step has its own color and order within the funnel
 */
export interface FunnelStep extends AppAwareDocument {
    funnelId: string;
    name: string;
    description?: string;
    color: string;
    order: number;
    status: ActiveStatus;
}
export interface CreateFunnelStepRequest {
    funnelId: string;
    name: string;
    description?: string;
    color: string;
    order?: number;
}
export interface UpdateFunnelStepRequest {
    name?: string;
    description?: string;
    color?: string;
    order?: number;
    status?: ActiveStatus;
}
export type FunnelStepResponse = Omit<FunnelStep, '_id'> & {
    id: string;
};
export interface FunnelStepQuery extends PaginationQuery {
    filters?: {
        funnelId?: string;
        status?: ActiveStatus;
        name?: string;
    };
}
export interface FunnelStepListResponse extends ListResponse<FunnelStepResponse> {
}
/**
 * Bulk operations
 */
export interface ReorderFunnelsRequest {
    funnelIds: string[];
}
export interface ReorderFunnelStepsRequest {
    stepIds: string[];
}
/**
 * Validation responses
 */
export interface FunnelDeleteValidation {
    canDelete: boolean;
    linkedLeadsCount: number;
    message: string;
}
export interface FunnelStepDeleteValidation {
    canDelete: boolean;
    linkedLeadsCount: number;
    message: string;
}

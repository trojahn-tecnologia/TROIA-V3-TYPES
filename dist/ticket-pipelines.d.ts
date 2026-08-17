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
/**
 * `true` quando a categoria congela o relógio de SLA (`slaBehavior: 'paused'`).
 * Derivado de `TICKET_STATUS_CATEGORIES` — nunca duplicar a lista de categorias
 * pausadas em outro lugar: mudar o catálogo tem que mudar o motor junto.
 *
 * Hoje só `waiting` pausa. `resolved`/`closed` são `'stopped'` (o relógio PARA,
 * não pausa) e `new`/`in_progress` são `'running'`.
 *
 * `category` fora do enum (dado legado, drift de schema) devolve `false` em vez
 * de lançar — acesso direto ao índice (`TICKET_STATUS_CATEGORIES[category]`)
 * derrubava o processo com `TypeError: Cannot read properties of undefined
 * (reading 'slaBehavior')`, e este é o único helper publicado para o
 * `statusCategory` da trilha: o leitor da trilha (`activities/repository.ts`)
 * só checa truthy e faz cast direto do documento, sem validar o enum em
 * runtime. O Plano B lê atividades HISTÓRICAS, onde divergência de enum é a
 * hipótese normal, não a exceção (CLAUDE.md NUNCA #52).
 */
export declare function isPausedCategory(category: TicketStatusCategory): boolean;
/**
 * Um "relógio" de estagnação de etapa do Helpdesk, com 2 limiares em HORAS.
 * Invariante validada no backend (`ticketAlertConfigSchema`): criticalHours > warningHours >= 1.
 *
 * Por que HORAS e não dias como o CRM (`AlertClockConfig`, alerts.ts): o card 07 do
 * Helpdesk exibe "há 2d 4h" e o trilho precisa de resolução sub-diária. Chamado parado
 * 6 horas numa etapa "Aguardando cliente" já é sinal; lead parado 6 horas numa etapa de
 * funil não é. As duas unidades são deliberadamente incompatíveis — a cascata é que é
 * compartilhada (`resolveClockCascade`), não o tipo.
 *
 * NÃO é SLA. Mede estagnação na coluna (a partir de `stageEnteredAt`), não contrato.
 */
export interface TicketAlertClockConfig {
    enabled: boolean;
    warningHours: number;
    criticalHours: number;
}
/** Relógios opcionais = herdam do nível acima (etapa → pipeline → sistema). */
export interface TicketAlertConfig {
    timeInStage?: TicketAlertClockConfig;
}
/** De onde veio o limiar efetivo — alimenta o pill "Personalizado"/"Padrão do pipeline". */
export type TicketAlertThresholdSource = 'stage' | 'pipeline' | 'system';
/** Resultado da cascata etapa → pipeline → sistema, carregando a origem. */
export interface ResolvedTicketAlertClocks {
    timeInStage: TicketAlertClockConfig;
    timeInStageSource: TicketAlertThresholdSource;
}
/** Default do sistema para pipeline/etapa sem config (dia 0). */
export declare const SYSTEM_TICKET_ALERT_DEFAULTS: {
    timeInStage: TicketAlertClockConfig;
};
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
    /**
     * Limites de estagnação por etapa herdados por todas as etapas deste pipeline.
     * Etapa com `alertConfig` próprio sobrepõe (ver `resolveTicketAlertClocks`).
     */
    alertConfig?: TicketAlertConfig;
}
export interface CreateTicketPipelineRequest {
    name: string;
    description?: string;
    color: string;
    order?: number;
    assignmentConfig?: DistributionConfig;
    alertConfig?: TicketAlertConfig;
}
export interface UpdateTicketPipelineRequest {
    name?: string;
    description?: string;
    color?: string;
    order?: number;
    status?: ActiveStatus;
    assignmentConfig?: DistributionConfig;
    alertConfig?: TicketAlertConfig;
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
    /** Override do limite de estagnação desta etapa. Ausente ou `{}` = herda do pipeline. */
    alertConfig?: TicketAlertConfig;
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
    alertConfig?: TicketAlertConfig;
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
    alertConfig?: TicketAlertConfig;
}
export type TicketStageResponse = Omit<TicketStage, '_id'> & {
    id: string;
    /**
     * Limiares EFETIVOS desta etapa após a cascata etapa → pipeline → sistema, com a origem.
     * Somente-leitura: NUNCA é persistido, NUNCA entra em Create/Update. Populado apenas por
     * `GET /api/ticket-stages/by-pipeline/:pipelineId` (ver `TicketStagesRepository.findByPipelineId`).
     */
    resolvedAlert?: ResolvedTicketAlertClocks;
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

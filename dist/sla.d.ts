/**
 * Motor de SLA — contratos compartilhados (spec §6, contrato de interfaces §1).
 *
 * Três decisões estruturais estão codificadas aqui e não devem ser desfeitas:
 *
 * 1. `targets` é LISTA de linhas `(clockKey, priority)`, não dicionário de
 *    chaves fixas por prioridade. É o que permite acrescentar um relógio novo
 *    (próxima resposta, atualização periódica) sem migrar forma — o erro que
 *    travou o contrato público da API do Freshdesk (spec §6.1).
 * 2. `useBusinessHours` e `pausesOn` vivem NA LINHA do alvo, não na política.
 *    É o que expressa "primeira resposta em horário comercial, resolução 24x7"
 *    dentro da mesma prioridade, e "resolução pausa em aguardando, primeira
 *    resposta não" (decisões 6 e 7 da spec §9).
 * 3. `policyId`/`policyVersion` vivem DENTRO de `SlaClock`, nunca na raiz de
 *    `SlaState`. A spec §7.3 prevê explicitamente dois relógios do MESMO
 *    chamado vindos de políticas diferentes (fallback real do estágio 2 da
 *    resolução) — com os campos na raiz, a prova contratual mentiria para um
 *    dos dois relógios.
 */
import type { PaginationQuery } from './common';
import type { TicketStatusCategory } from './ticket-pipelines';
import type { TicketPriority } from './tickets';
export type SlaEntityType = 'ticket' | 'conversation';
export type SlaClockKey = 'first_response' | 'resolution';
/**
 * Ordem de iteração canônica dos relógios. `resolvePolicy` percorre esta lista
 * para decidir o que ainda falta resolver — um relógio novo entra AQUI e no
 * tipo acima, e a resolução passa a considerá-lo sem mais nenhuma mudança.
 */
export declare const SLA_CLOCK_KEYS: readonly SlaClockKey[];
export type SlaClockState = 'running' | 'paused' | 'met' | 'breached' | 'cancelled';
export type SlaEscalationLevel = 'warning' | 'breach' | 'l2';
/** `'*'` é a linha coringa: casa qualquer prioridade que não tenha linha própria. */
export type SlaPriorityMatch = TicketPriority | '*';
/** `order` da política padrão semeada — sempre a última a ser avaliada. */
export declare const SLA_DEFAULT_POLICY_ORDER = 999;
export interface SlaTargetRow {
    clockKey: SlaClockKey;
    priority: SlaPriorityMatch;
    /** Orçamento de tempo em MILISSEGUNDOS. Nunca texto, nunca "dias" (spec §3.1e). */
    targetMs: number;
    /** `false` = 24x7: o cálculo pula o calendário e usa subtração de instantes. */
    useBusinessHours: boolean;
    /** Categorias de status que congelam ESTE relógio. Lista vazia = nunca pausa. */
    pausesOn: TicketStatusCategory[];
}
export interface SlaEscalationRow {
    clockKey: SlaClockKey;
    /** ASSINADO em relação ao vencimento: <0 aviso, 0 violação, >0 pós-violação. */
    offsetMs: number;
    level: SlaEscalationLevel;
    notify: {
        assignee: boolean;
        managers: boolean;
        teamIds: string[];
    };
}
/** Predicados de casamento. Campo ausente ou lista vazia = "qualquer valor". */
export interface SlaPolicyScope {
    customerIds?: string[];
    pipelineIds?: string[];
    stageIds?: string[];
    channelIds?: string[];
    categories?: string[];
    priorities?: TicketPriority[];
}
export interface SlaPolicy {
    id: string;
    appId: string;
    companyId: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    /** Copiado para dentro do relógio no início. Sobe a cada edição contratual. */
    version: number;
    /** Menor avalia antes (primeiro-que-casa). */
    order: number;
    /** Exatamente uma por empresa (índice único parcial + invariante no service). */
    isDefault: boolean;
    entityType: SlaEntityType;
    scope: SlaPolicyScope;
    /** ISO 8601. Vigência contratual — fora dela a política não casa. */
    validFrom?: string;
    validUntil?: string;
    targets: SlaTargetRow[];
    escalation: SlaEscalationRow[];
    /**
     * DECISÃO DO DONO (2026-07-28), default TRUE: resposta emitida por agente de
     * IA conta como primeira resposta. `findFirstMessageByDirection` do dashboard
     * já trata `senderType: 'ai'` como resposta humana hoje — a flag existe para
     * que a semântica seja escolhida por política em vez de ficar implícita.
     */
    countAiAsFirstResponse: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
/**
 * `SlaPolicy` já nasce com `id: string` (não tem `_id`), então a resposta HTTP é
 * o próprio tipo. O alias existe só para casar com a convenção `XResponse` que
 * o frontend e os hooks do projeto esperam.
 */
export type SlaPolicyResponse = SlaPolicy;
/**
 * `isDefault` NÃO entra aqui: quem promove uma política a padrão é
 * `POST /api/sla-policies/:id/set-default`, e quem cria a primeira é a
 * semeadura. Isso mantém a invariante "exatamente uma" em um único caminho.
 * `version`, `id`, `appId`, `companyId`, `createdAt`, `updatedAt` e `status`
 * são do servidor.
 */
export interface CreateSlaPolicyRequest {
    name: string;
    description?: string;
    entityType: SlaEntityType;
    order?: number;
    scope?: SlaPolicyScope;
    validFrom?: string;
    validUntil?: string;
    targets: SlaTargetRow[];
    escalation?: SlaEscalationRow[];
    countAiAsFirstResponse?: boolean;
}
export interface UpdateSlaPolicyRequest extends Partial<Omit<CreateSlaPolicyRequest, 'entityType'>> {
    /** Trocar o tipo de entidade de uma política viva reabriria relógios de outra coleção — proibido. */
    status?: 'active' | 'inactive';
}
export interface ReorderSlaPoliciesRequest {
    policyIds: string[];
}
export interface SlaPolicyQuery extends PaginationQuery {
    filters?: {
        status?: 'active' | 'inactive';
        entityType?: SlaEntityType;
        isDefault?: boolean;
    };
}
export interface SlaClock {
    policyId: string;
    policyVersion: number;
    targetMs: number;
    useBusinessHours: boolean;
    pausesOn: TicketStatusCategory[];
    /** Agrupa as N ocorrências de um relógio recorrente. Chave de idempotência do log. */
    instanceId: string;
    state: SlaClockState;
    startedAt: string;
    /** Prazo VIGENTE — desloca a cada retomada de pausa. */
    dueAt: string;
    /** Promessa original — imutável depois do início. */
    originalDueAt: string;
    pausedSince?: string;
    pausedBusinessMs: number;
    stoppedAt?: string;
    breachedAt?: string;
    elapsedBusinessMs: number;
    elapsedCalendarMs: number;
    /** Carimbo de ativação do motor; imutável; base da supressão de eco do passado. */
    activatedAt?: string;
}
export interface SlaState {
    clocks: Partial<Record<SlaClockKey, SlaClock>>;
}
export type SlaEventType = 'policy_applied' | 'start' | 'pause' | 'resume' | 'target_changed' | 'breach' | 'meet' | 'cancel' | 'discard';
export interface SlaClockEvent {
    id: string;
    appId: string;
    companyId: string;
    entityType: SlaEntityType;
    entityId: string;
    clockKey: SlaClockKey;
    instanceId: string;
    type: SlaEventType;
    /** Só em eventos de notificação. */
    level?: SlaEscalationLevel;
    at: string;
    reason?: string;
    /** Inclui `{ suppressed: true }` na estreia do motor. */
    context?: Record<string, unknown>;
    actor: {
        type: 'system' | 'user' | 'workflow' | 'agent';
        id?: string;
    };
    snapshot?: {
        policyId: string;
        policyVersion: number;
        targetMs: number;
        useBusinessHours: boolean;
    };
    elapsedBusinessMs: number;
    elapsedCalendarMs: number;
}
/** Payload de escrita de `ISlaEventsService.appendMany` (contrato §5). */
export type CreateSlaClockEvent = Omit<SlaClockEvent, 'id'>;

/**
 * Contratos genéricos do Kanban em escala (SP1 — 2026-07-16).
 * Usados por leads hoje; desenhados para tickets (SP3) e atendimentos (SP4).
 */

export interface KanbanColumnPage<T> {
  columnId: string;
  /** Total REAL da coluna no backend, respeitando todos os filtros ativos. */
  count: number;
  /** Soma do campo de valor (leads: budget) da coluna INTEIRA. */
  totalValue: number;
  items: T[];
  /** Cursor opaco da próxima página; null = fim. */
  nextCursor: string | null;
}

export interface KanbanBoardAggregates {
  /** Σ counts das colunas exibidas. */
  total: number;
  /** Σ totalValue das colunas exibidas. */
  totalValue: number;
  businessStatusCounts: { pending: number; won: number; lost: number };
  priorityCounts: { urgent: number; high: number; medium: number; low: number };
}

/** TAggregates com default = retrocompatível com o board de leads (SP1/SP2). */
export interface KanbanBoardResponse<T, TAggregates = KanbanBoardAggregates> {
  columns: KanbanColumnPage<T>[];
  aggregates: TAggregates;
}

// ============================================================================
// ORDENAÇÃO (SP2 — 2026-07-16)
// ============================================================================

/** Modos de ordenação do kanban. Cada módulo suporta um subconjunto (whitelist no backend). */
export type KanbanSortMode =
  | 'created'      // mais novo primeiro (default — comportamento atual)
  | 'stepEntered'  // há mais tempo na etapa primeiro
  | 'priority'     // urgente → alta → média → baixa → sem prioridade
  | 'idle'         // mais tempo sem INTERAÇÃO primeiro (nunca interagiu = topo)
  | 'inactivity'   // mais tempo sem ATIVIDADE primeiro (nunca teve atividade = topo)
  | 'manual';      // rank fractional persistido (drag)

export const LEAD_KANBAN_SORT_MODES: KanbanSortMode[] =
  ['created', 'stepEntered', 'priority', 'idle', 'inactivity', 'manual'];

// ============================================================================
// KANBAN DE TICKETS (SP3 — 2026-07-16)
// ============================================================================

/** Aggregates do board de tickets — sem valor monetário (tickets não têm budget). */
export interface TicketKanbanBoardAggregates {
  total: number;
  /** Contagem por statusCategory de TODOS os tickets matched do pipeline (não só janelas). */
  statusCategoryCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}

/** Modos de ordenação suportados pelo kanban de tickets (SP3). Sem 'idle' — tickets têm uma única fonte de interação. */
export const TICKET_KANBAN_SORT_MODES = ['created', 'stepEntered', 'priority', 'inactivity', 'manual'] as const satisfies readonly KanbanSortMode[];

// ============================================================================
// KANBAN DE ATENDIMENTOS (SP4 — 2026-07-16)
// ============================================================================

/** Modos do kanban de atendimentos (SP4). Sem manual (lanes derivadas) e sem idle (fonte única lastMessageAt). */
export const CONVERSATION_KANBAN_SORT_MODES = ['created', 'priority', 'inactivity'] as const satisfies readonly KanbanSortMode[];

/** Lanes fixas do kanban de atendimentos — predicados server-side (SP4 D1). */
export type ConversationKanbanLaneId = 'ai' | 'queue' | 'inService' | 'transferred' | 'closed';
export const CONVERSATION_KANBAN_LANE_IDS = ['ai', 'queue', 'inService', 'transferred', 'closed'] as const;

/** Aggregates do board de atendimentos — counts por lane já vêm nos `count` das colunas (D4). */
export interface ConversationKanbanBoardAggregates {
  total: number;
}

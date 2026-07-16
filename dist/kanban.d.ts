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
    businessStatusCounts: {
        pending: number;
        won: number;
        lost: number;
    };
    priorityCounts: {
        urgent: number;
        high: number;
        medium: number;
        low: number;
    };
}
export interface KanbanBoardResponse<T> {
    columns: KanbanColumnPage<T>[];
    aggregates: KanbanBoardAggregates;
}

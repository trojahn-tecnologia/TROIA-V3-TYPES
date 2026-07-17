"use strict";
/**
 * Contratos genéricos do Kanban em escala (SP1 — 2026-07-16).
 * Usados por leads hoje; desenhados para tickets (SP3) e atendimentos (SP4).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONVERSATION_KANBAN_LANE_IDS = exports.CONVERSATION_KANBAN_SORT_MODES = exports.TICKET_KANBAN_SORT_MODES = exports.LEAD_KANBAN_SORT_MODES = void 0;
exports.LEAD_KANBAN_SORT_MODES = ['created', 'stepEntered', 'priority', 'idle', 'inactivity', 'manual'];
/** Modos de ordenação suportados pelo kanban de tickets (SP3). Sem 'idle' — tickets têm uma única fonte de interação. */
exports.TICKET_KANBAN_SORT_MODES = ['created', 'stepEntered', 'priority', 'inactivity', 'manual'];
// ============================================================================
// KANBAN DE ATENDIMENTOS (SP4 — 2026-07-16)
// ============================================================================
/** Modos do kanban de atendimentos (SP4). Sem manual (lanes derivadas) e sem idle (fonte única lastMessageAt). */
exports.CONVERSATION_KANBAN_SORT_MODES = ['created', 'priority', 'inactivity'];
exports.CONVERSATION_KANBAN_LANE_IDS = ['ai', 'queue', 'inService', 'transferred', 'closed'];

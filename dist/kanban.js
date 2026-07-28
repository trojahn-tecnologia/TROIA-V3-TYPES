"use strict";
/**
 * Contratos genéricos do Kanban em escala (SP1 — 2026-07-16).
 * Usados por leads hoje; desenhados para tickets (SP3) e atendimentos (SP4).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCardDensity = exports.CARD_DENSITIES = exports.CONVERSATION_KANBAN_LANE_IDS = exports.CONVERSATION_KANBAN_SORT_MODES = exports.TICKET_KANBAN_SORT_MODES = exports.LEAD_KANBAN_SORT_MODES = void 0;
exports.LEAD_KANBAN_SORT_MODES = ['created', 'stepEntered', 'priority', 'idle', 'inactivity', 'manual'];
/** Modos de ordenação suportados pelo kanban de tickets (SP3). Sem 'idle' — tickets têm uma única fonte de interação. */
exports.TICKET_KANBAN_SORT_MODES = ['created', 'stepEntered', 'priority', 'inactivity', 'manual'];
// ============================================================================
// KANBAN DE ATENDIMENTOS (SP4 — 2026-07-16)
// ============================================================================
/** Modos do kanban de atendimentos (SP4). Sem manual (lanes derivadas) e sem idle (fonte única lastMessageAt). */
exports.CONVERSATION_KANBAN_SORT_MODES = ['created', 'priority', 'inactivity'];
exports.CONVERSATION_KANBAN_LANE_IDS = ['ai', 'queue', 'inService', 'transferred', 'closed'];
/** Ordem canônica de exibição no seletor: do mais denso em informação ao mais enxuto. */
exports.CARD_DENSITIES = ['detailed', 'normal', 'compact'];
/**
 * Guard para o que vem do localStorage. Valor inválido no storage não pode
 * quebrar a tela — o caller cai no default do próprio módulo.
 */
const isCardDensity = (value) => typeof value === 'string' && exports.CARD_DENSITIES.includes(value);
exports.isCardDensity = isCardDensity;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_TICKET_ALERT_DEFAULTS = exports.TICKET_STATUS_CATEGORIES = void 0;
exports.isPausedCategory = isPausedCategory;
exports.TICKET_STATUS_CATEGORIES = {
    new: { label: 'Novo', slaBehavior: 'running', color: '#3B82F6' },
    in_progress: { label: 'Em Andamento', slaBehavior: 'running', color: '#8B5CF6' },
    waiting: { label: 'Aguardando', slaBehavior: 'paused', color: '#F59E0B' },
    resolved: { label: 'Resolvido', slaBehavior: 'stopped', color: '#10B981' },
    closed: { label: 'Fechado', slaBehavior: 'stopped', color: '#6B7280' },
};
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
function isPausedCategory(category) {
    return exports.TICKET_STATUS_CATEGORIES[category]?.slaBehavior === 'paused';
}
/** Default do sistema para pipeline/etapa sem config (dia 0). */
exports.SYSTEM_TICKET_ALERT_DEFAULTS = {
    timeInStage: { enabled: true, warningHours: 24, criticalHours: 72 },
};

"use strict";
/**
 * Gamificação — tabela de pontos, níveis, livro-caixa e ranking (spec §4.5).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GAMIFICATION_LEVELS = exports.DEFAULT_GAMIFICATION_RULES = void 0;
exports.DEFAULT_GAMIFICATION_RULES = [
    { key: 'lead_captured', label: 'Lead captado e confirmado', points: 1, enabled: true, dailyCap: 15 },
    { key: 'form_completed', label: 'Formulário de captura preenchido', points: 3, enabled: true },
    { key: 'lead_won', label: 'Venda fechada', points: 10, enabled: true, reversalDays: 7 },
];
exports.DEFAULT_GAMIFICATION_LEVELS = [
    { name: 'Bronze', minPoints: 0 },
    { name: 'Prata', minPoints: 500 },
    { name: 'Ouro', minPoints: 2000 },
    { name: 'Diamante', minPoints: 5000 },
];

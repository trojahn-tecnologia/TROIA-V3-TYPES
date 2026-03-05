"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKET_STATUS_CATEGORIES = void 0;
exports.TICKET_STATUS_CATEGORIES = {
    new: { label: 'Novo', slaBehavior: 'running', color: '#3B82F6' },
    in_progress: { label: 'Em Andamento', slaBehavior: 'running', color: '#8B5CF6' },
    waiting: { label: 'Aguardando', slaBehavior: 'paused', color: '#F59E0B' },
    resolved: { label: 'Resolvido', slaBehavior: 'stopped', color: '#10B981' },
    closed: { label: 'Fechado', slaBehavior: 'stopped', color: '#6B7280' },
};

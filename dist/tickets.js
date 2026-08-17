"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKET_STATUS_CHANGE_ACTION = void 0;
// ============================================================================
// TRILHA DE MUDANÇA DE ETAPA (Fase 0 do motor de SLA)
// ============================================================================
/**
 * `action` das atividades de trilha. `type` continua sendo `'status_change'`
 * (valor já existente em `ActivityType`); o `action` é o que a timeline do
 * chamado recebe como `activityType` (`tickets/timeline-service.ts` mapeia
 * `activity.action || activity.type`).
 */
exports.TICKET_STATUS_CHANGE_ACTION = 'status_changed';

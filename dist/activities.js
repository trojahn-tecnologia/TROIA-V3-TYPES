"use strict";
// Activity Types - Sistema de atividades e logs do sistema
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALES_ACTIVITY_ACTIONS = void 0;
// ============================================================================
// Sales Activity Actions — usados pelo módulo `goals` (Phase 3 dashboards)
// ============================================================================
//
// Constants padronizadas para registrar ações de vendas no módulo `activities`.
// O dashboard comercial conta `Activity` documents filtrando por `action` para
// apurar atingimento das metas (calls, meetings, proposalsSent).
//
// Fluxo típico: services de domínio (calls, calendar, leads) emitem activities
// com `action: SALES_ACTIVITY_ACTIONS.CALL_MADE` ao registrar a ocorrência.
exports.SALES_ACTIVITY_ACTIONS = {
    CALL_MADE: 'Ligação realizada',
    LEAD_QUALIFIED: 'Lead qualificado',
    PROPOSAL_SENT: 'Proposta enviada',
};

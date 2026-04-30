import { ObjectId } from 'mongodb';
import { FullTenantDocument, ActiveStatus, PaginationQuery, GenericQueryOptions, ListResponse } from './common';
/**
 * Goals module — cadastro de metas para vendedores, equipes e empresa.
 *
 * Metric: indicador medido (revenue, deals, calls, meetings, qualifiedLeads, proposalsSent).
 * Period: granularidade temporal (month, quarter, year).
 * Assignee: a quem a meta pertence (user, team, company).
 *
 * Atingimento da meta é calculado em runtime no dashboard a partir de:
 * - leads (revenue, deals, qualifiedLeads)
 * - activities (calls, meetings, proposalsSent — via SALES_ACTIVITY_ACTIONS)
 */
export type GoalAssigneeType = 'user' | 'team' | 'company';
export type GoalMetric = 'revenue' | 'deals' | 'calls' | 'meetings' | 'qualifiedLeads' | 'proposalsSent';
export type GoalPeriod = 'month' | 'quarter' | 'year';
export interface Goal extends FullTenantDocument {
    assigneeType: GoalAssigneeType;
    /**
     * ID do user ou team a quem a meta pertence.
     * - assigneeType='user'    → ObjectId do user
     * - assigneeType='team'    → ObjectId do team
     * - assigneeType='company' → null (meta da empresa toda)
     */
    assigneeId?: ObjectId | null;
    metric: GoalMetric;
    period: GoalPeriod;
    /** Início do período (ISO date string ou Date no DB). */
    periodStart: Date | string;
    /** Fim do período (ISO date string ou Date no DB). */
    periodEnd: Date | string;
    /** Valor alvo da meta (ex: 100000 para revenue, 30 para deals). */
    targetValue: number;
    notes?: string;
    status: ActiveStatus;
}
export interface GoalResponse extends Omit<Goal, '_id' | 'assigneeId' | 'companyId' | 'appId'> {
    id: string;
    /** ObjectId convertido para string. null quando assigneeType='company'. */
    assigneeId?: string | null;
    /** Nome populado via Two-Phase Fetch (user firstName/lastName ou team name). null para company. */
    assigneeName?: string | null;
    companyId: string;
    appId: string;
}
export interface GoalQuery extends PaginationQuery {
    assigneeType?: GoalAssigneeType;
    assigneeId?: string;
    metric?: GoalMetric;
    period?: GoalPeriod;
    /** Filtro: metas cuja janela [periodStart, periodEnd] intersecta esta data. */
    periodStart?: string;
    periodEnd?: string;
    status?: ActiveStatus;
    search?: string;
}
export interface GoalListResponse extends ListResponse<GoalResponse> {
}
export interface GoalQueryOptions extends GenericQueryOptions<GoalQuery> {
}
export interface CreateGoalRequest {
    assigneeType: GoalAssigneeType;
    assigneeId?: string | null;
    metric: GoalMetric;
    period: GoalPeriod;
    periodStart: string;
    periodEnd: string;
    targetValue: number;
    notes?: string;
}
export interface UpdateGoalRequest {
    assigneeType?: GoalAssigneeType;
    assigneeId?: string | null;
    metric?: GoalMetric;
    period?: GoalPeriod;
    periodStart?: string;
    periodEnd?: string;
    targetValue?: number;
    notes?: string;
    status?: ActiveStatus;
}

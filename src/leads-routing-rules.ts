import { ObjectId } from 'mongodb';
import { ActiveStatus, PaginationQuery } from './common';

/**
 * Lead Routing Condition - a single condition to evaluate against lead data
 */
export interface LeadRoutingCondition {
  field: 'campaignName' | 'channel' | 'origin' | 'source' | 'medium' | 'segment' | 'adName' | 'adsetName';
  operator: 'equals' | 'contains' | 'in';
  value: string | string[];
}

/**
 * Lead Routing Rule - automatic lead assignment based on field conditions
 * Rules are linked to funnels and evaluated BEFORE the Lottery Engine
 */
export interface LeadRoutingRule {
  _id?: ObjectId | undefined;
  id?: string | undefined;
  name: string;
  description?: string | undefined;
  funnelId: string;
  assigneeId: string;
  assigneeIds: string[];
  /**
   * Contador monotônico de rotação incrementado atomicamente via `$inc`.
   * O userId escolhido é `assigneeIds[lastAssignedUserId % assigneeIds.length]`.
   *
   * Ver decisão D4 no plano ASSIGNMENTS_REMOVAL.md — substitui o mecanismo
   * legado de guardar o último userId (que tinha race condition).
   */
  lastAssignedUserId?: number | undefined;
  conditions: LeadRoutingCondition[];
  priority: number;
  status: ActiveStatus;
  appId: ObjectId | string;
  companyId: ObjectId | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | undefined;
}

export interface LeadRoutingRuleResponse extends Omit<LeadRoutingRule, '_id'> {
  id: string;
}

export interface CreateLeadRoutingRuleRequest {
  name: string;
  description?: string | undefined;
  funnelId: string;
  assigneeId?: string | undefined;
  assigneeIds?: string[] | undefined;
  conditions: LeadRoutingCondition[];
  priority: number;
}

export interface UpdateLeadRoutingRuleRequest {
  name?: string | undefined;
  description?: string | undefined;
  funnelId?: string | undefined;
  assigneeId?: string | undefined;
  assigneeIds?: string[] | undefined;
  conditions?: LeadRoutingCondition[] | undefined;
  priority?: number | undefined;
}

/**
 * Result of evaluating routing rules against lead data
 */
export interface LeadRoutingEvaluationResult {
  assigneeId: string;
  ruleId: string;
  ruleName: string;
}

export interface LeadRoutingRuleQuery extends PaginationQuery {
  status?: ActiveStatus | undefined;
  funnelId?: string | undefined;
}

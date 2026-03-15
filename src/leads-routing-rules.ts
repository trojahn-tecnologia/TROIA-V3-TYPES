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
  _id?: ObjectId;
  id?: string;
  name: string;
  description?: string;
  funnelId: string;
  assigneeId: string;
  assigneeIds: string[];
  lastAssignedUserId?: string;
  conditions: LeadRoutingCondition[];
  priority: number;
  status: ActiveStatus;
  appId: ObjectId | string;
  companyId: ObjectId | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
}

export interface LeadRoutingRuleResponse extends Omit<LeadRoutingRule, '_id'> {
  id: string;
}

export interface CreateLeadRoutingRuleRequest {
  name: string;
  description?: string;
  funnelId: string;
  assigneeId?: string;
  assigneeIds?: string[];
  conditions: LeadRoutingCondition[];
  priority: number;
}

export interface UpdateLeadRoutingRuleRequest {
  name?: string;
  description?: string;
  funnelId?: string;
  assigneeId?: string;
  assigneeIds?: string[];
  conditions?: LeadRoutingCondition[];
  priority?: number;
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
  status?: ActiveStatus;
  funnelId?: string;
}

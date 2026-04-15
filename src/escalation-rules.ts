import { ObjectId } from 'mongodb';
import { ActiveStatus, PaginationQuery } from './common';

// AI Agent Escalation Rule (different from Assignment EscalationRule)
export interface AgentEscalationRule {
  _id?: ObjectId | undefined;
  id?: string | undefined;
  name: string;
  description?: string | undefined;
  assigneeType: 'team' | 'user';
  assigneeId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  escalationDelay?: number | undefined;
  notifyAssignee: boolean;
  notificationChannels?: ('email' | 'sms' | 'push')[] | undefined;
  appId: ObjectId | string;
  companyId: ObjectId | string;
  status: ActiveStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | undefined;
}

export interface AgentEscalationRuleResponse extends Omit<AgentEscalationRule, '_id'> {
  id: string;
}

export interface CreateAgentEscalationRuleRequest {
  name: string;
  description?: string | undefined;
  assigneeType: 'team' | 'user';
  assigneeId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  escalationDelay?: number | undefined;
  notifyAssignee?: boolean | undefined;
  notificationChannels?: ('email' | 'sms' | 'push')[] | undefined;
}

export interface UpdateAgentEscalationRuleRequest {
  name?: string | undefined;
  description?: string | undefined;
  assigneeType?: 'team' | 'user' | undefined;
  assigneeId?: string | undefined;
  priority?: 'low' | 'medium' | 'high' | 'urgent' | undefined;
  escalationDelay?: number | undefined;
  notifyAssignee?: boolean | undefined;
  notificationChannels?: ('email' | 'sms' | 'push')[] | undefined;
}

export interface AgentEscalationRuleQuery extends PaginationQuery {
  status?: ActiveStatus | undefined;
  assigneeType?: 'team' | 'user' | undefined;
  priority?: 'low' | 'medium' | 'high' | 'urgent' | undefined;
}

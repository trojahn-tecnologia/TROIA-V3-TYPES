/**
 * Ticket-Pipelines-Users — Module Types
 *
 * Tabela pivot `ticket-pipelines-users` que associa usuários a pipelines
 * de ticket para responder três perguntas simultaneamente:
 *
 * 1. **Quem vê o pipeline na listagem?** (visibilidade do contexto)
 * 2. **Quem vê os tickets do pipeline?** (scope: own/team/all)
 * 3. **Quem recebe distribuição automática?** (role=attendant)
 *
 * Espelha `funnels-users` e `channels-users`. Sem abstração compartilhada
 * (D9b) — apenas enums de `role` e `scope` vêm de `context-users.ts`.
 *
 * Collection: `ticket-pipelines-users`
 */

import { ObjectId } from 'mongodb';

import type { ActiveStatus, PaginationQuery } from './common';
import type { ContextUserRole, ContextUserScope } from './context-users';

// ============================================================================
// ENTITY
// ============================================================================

export interface TicketPipelineUser {
  pipelineId: ObjectId;
  userId: ObjectId;
  role: ContextUserRole;
  scope: ContextUserScope;
  priority?: number | null;
  status: ActiveStatus;
  assignedAt: Date;
  companyId: ObjectId;
  appId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// QUERY
// ============================================================================

export interface TicketPipelineUserQuery extends PaginationQuery {
  pipelineId?: string;
  userId?: string;
  role?: ContextUserRole;
  scope?: ContextUserScope;
  status?: ActiveStatus;
}

// ============================================================================
// RESPONSE
// ============================================================================

export interface TicketPipelineUserResponse {
  id: string;
  pipelineId: string;
  userId: string;
  role: ContextUserRole;
  scope: ContextUserScope;
  priority: number | null;
  status: ActiveStatus;
  assignedAt: string;
  companyId: string;
  appId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// REQUESTS
// ============================================================================

export interface AddTicketPipelineUserRequest {
  userId: string;
  role: ContextUserRole;
  scope?: ContextUserScope;
  priority?: number | null;
}

export interface UpdateTicketPipelineUserRequest {
  role?: ContextUserRole;
  scope?: ContextUserScope;
  priority?: number | null;
  status?: ActiveStatus;
}

// ============================================================================
// STATS
// ============================================================================

export interface TicketPipelineUsersStats {
  total: number;
  byRole: {
    attendant: number;
    viewer: number;
  };
}

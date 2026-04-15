/**
 * Funnels-Users — Module Types
 *
 * Tabela pivot `funnels-users` que associa usuários a funis para responder
 * três perguntas simultaneamente:
 *
 * 1. **Quem vê o funil na listagem?** (visibilidade do contexto)
 * 2. **Quem vê os leads do funil?** (scope: own/team/all)
 * 3. **Quem recebe distribuição automática?** (role=attendant)
 *
 * Este é o análogo ao `channels-users` já existente, replicado para funis
 * conforme decisão D9 do plano `@DOCS/architecture/ASSIGNMENTS_REMOVAL.md`.
 * Não há abstração compartilhada (D9b) — apenas os enums de `role` e
 * `scope` vêm do arquivo `context-users.ts`.
 *
 * Collection: `funnels-users`
 *
 * Regra "público se vazio" (D11): se um funil não possui NENHUM registro
 * em `funnels-users` ativo, ele é visível para todos os usuários da company.
 * Assim que pelo menos 1 usuário é cadastrado, o funil passa a ser restrito.
 */

import { ObjectId } from 'mongodb';

import type { ActiveStatus, PaginationQuery } from './common';
import type { ContextUserRole, ContextUserScope } from './context-users';

// ============================================================================
// ENTITY
// ============================================================================

export interface FunnelUser {
  funnelId: ObjectId;
  userId: ObjectId;
  role: ContextUserRole; // 'attendant' | 'viewer'
  scope: ContextUserScope; // 'own' | 'team' | 'all'
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

export interface FunnelUserQuery extends PaginationQuery {
  funnelId?: string;
  userId?: string;
  role?: ContextUserRole;
  scope?: ContextUserScope;
  status?: ActiveStatus;
}

// ============================================================================
// RESPONSE
// ============================================================================

export interface FunnelUserResponse {
  id: string;
  funnelId: string;
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

export interface AddFunnelUserRequest {
  userId: string;
  role: ContextUserRole;
  scope?: ContextUserScope;
  priority?: number | null;
}

export interface UpdateFunnelUserRequest {
  role?: ContextUserRole;
  scope?: ContextUserScope;
  priority?: number | null;
  status?: ActiveStatus;
}

// ============================================================================
// STATS (para UI da aba "Usuários")
// ============================================================================

export interface FunnelUsersStats {
  total: number;
  byRole: {
    attendant: number;
    viewer: number;
  };
}

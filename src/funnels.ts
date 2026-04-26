import { PaginationQuery, ListResponse, AppAwareDocument, ActiveStatus } from './common';
import type { DistributionConfig } from './distribution';

/**
 * Funnel - Sales funnel structure
 * Each funnel has its own independent steps.
 *
 * Distribuição: `assignmentConfig` é unificado em `DistributionConfig` —
 * mesmo shape para channels, funnels e ticket-pipelines. Processado por um
 * único `DistributionService` no backend.
 *
 * Ver plano: DOCS/architecture/ASSIGNMENTS_REMOVAL.md
 */
export interface Funnel extends AppAwareDocument {
  name: string;
  description?: string;
  color: string;              // Hex color (e.g., "#8b5cf6")
  order: number;              // Display order (customizable)
  status: ActiveStatus;
  /** Distribuição automática de leads — config unificada (D8, D9). */
  assignmentConfig?: DistributionConfig;
  /**
   * Contador monotônico de rotação usado por `DistributionService`.
   * Incrementado atomicamente via `$inc` a cada atribuição. O userId
   * selecionado é `pool[lastAssignedUserId % pool.length]`.
   *
   * Mantém o nome legado para preservar o campo no MongoDB mas muda
   * semântica de "id do último usuário" (string) para "contador sequencial"
   * (number). Ver decisão D4 / D_fase1b no plano.
   */
  lastAssignedUserId?: number;
  /** Permite criar leads duplicados (mesmo contactId) neste funil. Leads em funis diferentes não são afetados. Default: true */
  allowDuplicateContacts?: boolean;
  /** Tipos de lead disponíveis neste funil (ex: Venda, Suporte, Consultoria) */
  types?: string[];
}

export interface CreateFunnelRequest {
  name: string;
  description?: string;
  color: string;
  order?: number;
  assignmentConfig?: DistributionConfig;
  /** Permite criar leads duplicados (mesmo contactId) neste funil. Leads em funis diferentes não são afetados. Default: true */
  allowDuplicateContacts?: boolean;
  /** Tipos de lead disponíveis neste funil */
  types?: string[];
}

export interface UpdateFunnelRequest {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
  status?: ActiveStatus;
  assignmentConfig?: DistributionConfig;
  /** Permite criar leads duplicados (mesmo contactId) neste funil. Leads em funis diferentes não são afetados. Default: true */
  allowDuplicateContacts?: boolean;
  /** Tipos de lead disponíveis neste funil */
  types?: string[];
}

export type FunnelResponse = Omit<Funnel, '_id'> & {
  id: string;
  /**
   * Scope do usuário logado neste funil (proveniente de `funnels-users`).
   * - `'own'` | `'team'` | `'all'`: user tem entry ativa com esse scope
   * - `null` ou ausente: user não tem entry ativa (D-context-gate inativo)
   *
   * Frontend usa pra esconder/filtrar UI:
   * - Filtro de operadores aparece se `userScope === 'team' | 'all'`
   * - Em `'team'` o dropdown de users deve ser filtrado pra mostrar só
   *   operadores das mesmas teams que o user logado.
   */
  userScope?: 'own' | 'team' | 'all' | null;
};

export interface FunnelQuery extends PaginationQuery {
  filters?: {
    status?: ActiveStatus;
    name?: string;
  };
}

export interface FunnelListResponse extends ListResponse<FunnelResponse> {}

/**
 * FunnelStep - Individual stages within a funnel
 * Each step has its own color and order within the funnel
 */
export interface FunnelStep extends AppAwareDocument {
  funnelId: string;           // Parent funnel
  name: string;
  description?: string;
  color: string;              // Hex color (e.g., "#10b981")
  order: number;              // Display order within funnel (customizable)
  status: ActiveStatus;
}

export interface CreateFunnelStepRequest {
  funnelId: string;
  name: string;
  description?: string;
  color: string;
  order?: number;
}

export interface UpdateFunnelStepRequest {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
  status?: ActiveStatus;
}

export type FunnelStepResponse = Omit<FunnelStep, '_id'> & { id: string };

export interface FunnelStepQuery extends PaginationQuery {
  filters?: {
    funnelId?: string;
    status?: ActiveStatus;
    name?: string;
  };
}

export interface FunnelStepListResponse extends ListResponse<FunnelStepResponse> {}

/**
 * Bulk operations
 */
export interface ReorderFunnelsRequest {
  funnelIds: string[];        // Array of funnel IDs in new order
}

export interface ReorderFunnelStepsRequest {
  stepIds: string[];          // Array of step IDs in new order
}

/**
 * Validation responses
 */
export interface FunnelDeleteValidation {
  canDelete: boolean;
  linkedLeadsCount: number;
  message: string;
}

export interface FunnelStepDeleteValidation {
  canDelete: boolean;
  linkedLeadsCount: number;
  message: string;
}

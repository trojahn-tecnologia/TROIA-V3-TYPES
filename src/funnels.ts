import { PaginationQuery, ListResponse, AppAwareDocument, ActiveStatus } from './common';
import type { DistributionConfig } from './distribution';
import type { AlertConfig } from './alerts';

/**
 * Captura de leads por QR Code (D16). "Ligada" = objeto presente (qualquer
 * campo). `channelId` preenchido = Etapa 2 (confirmação no WhatsApp) ligada.
 * `message` aceita a variável `{{code}}`.
 */
export interface FunnelCaptureConfig {
  /** Modelo de captura (`Form` com `type: 'form'`). */
  formId?: string;
  /** Canal WhatsApp de confirmação; preenchido = Etapa 2 ligada. */
  channelId?: string;
  /** Ex.: "Olá! Quero participar da promoção. Código {{code}}" */
  message?: string;
  /** Texto LGPD da página pública (D9). */
  consentText?: string;
  /** Página pública: e-mail obrigatório (default: opcional). */
  emailRequired?: boolean;
}

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
  /**
   * Escopo da checagem de duplicados quando allowDuplicateContacts === false.
   * 'funnel' = considera apenas leads deste funil (default).
   * 'all_funnels' = considera leads em andamento de qualquer funil do tenant.
   */
  duplicateCheckScope?: 'funnel' | 'all_funnels';
  /** Tipos de lead disponíveis neste funil (ex: Venda, Suporte, Consultoria) */
  types?: string[];
  /** Config default dos alertas de inatividade deste funil (override por etapa em FunnelStep). */
  alertConfig?: AlertConfig;
  /** Captura por QR Code (D16). Ausente = captura desligada neste funil. */
  capture?: FunnelCaptureConfig;
}

export interface CreateFunnelRequest {
  name: string;
  description?: string;
  color: string;
  order?: number;
  assignmentConfig?: DistributionConfig;
  /** Permite criar leads duplicados (mesmo contactId) neste funil. Leads em funis diferentes não são afetados. Default: true */
  allowDuplicateContacts?: boolean;
  /**
   * Escopo da checagem de duplicados quando allowDuplicateContacts === false.
   * 'funnel' = considera apenas leads deste funil (default).
   * 'all_funnels' = considera leads em andamento de qualquer funil do tenant.
   */
  duplicateCheckScope?: 'funnel' | 'all_funnels';
  /** Tipos de lead disponíveis neste funil */
  types?: string[];
  /** Config default dos alertas de inatividade deste funil. */
  alertConfig?: AlertConfig;
  /** Captura por QR Code (D16). */
  capture?: FunnelCaptureConfig;
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
  /**
   * Escopo da checagem de duplicados quando allowDuplicateContacts === false.
   * 'funnel' = considera apenas leads deste funil (default).
   * 'all_funnels' = considera leads em andamento de qualquer funil do tenant.
   */
  duplicateCheckScope?: 'funnel' | 'all_funnels';
  /** Tipos de lead disponíveis neste funil */
  types?: string[];
  /** Config default dos alertas de inatividade deste funil. */
  alertConfig?: AlertConfig;
  /** Captura por QR Code (D16). `null` = desligar (remove o bloco). */
  capture?: FunnelCaptureConfig | null;
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
  /**
   * `true` se o funil tem pelo menos 1 entry ativa em `funnels-users`
   * (qualquer usuário, não só o logado). `false` = funil órfão — D-context-gate
   * inativo: leads não aparecem em listagens e distribuição não roda.
   * Campo computado no read (getAll/dropdown); ausente em endpoints que não
   * enriquecem (retrocompat).
   */
  hasUsers?: boolean;
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
  /** Override opcional dos alertas de inatividade nesta etapa (por relógio; herda do funil). */
  alertConfig?: AlertConfig;
}

export interface CreateFunnelStepRequest {
  funnelId: string;
  name: string;
  description?: string;
  color: string;
  order?: number;
  /** Override opcional dos alertas de inatividade nesta etapa. */
  alertConfig?: AlertConfig;
}

export interface UpdateFunnelStepRequest {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
  status?: ActiveStatus;
  /** Override opcional dos alertas de inatividade nesta etapa. */
  alertConfig?: AlertConfig;
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

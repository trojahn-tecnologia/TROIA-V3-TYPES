import { ObjectId } from 'mongodb';
import { FullTenantDocument, ActiveStatus, PaginationQuery, GenericQueryOptions, ListResponse } from './common';
import { ModulePermission, ValidModuleId } from './modules';

/**
 * Tela inicial atribuída ao Level — define onde o usuário cai ao logar.
 *
 * Validação backend: se definida, o Level precisa ter permission `read` no
 * módulo correspondente (mesmo request).
 *
 * Default no frontend (quando undefined): 'dashboards-support'.
 *
 * Tipo derivado de `ValidModuleId` via `Extract<>` — adicionar um valor aqui
 * que não exista em `ValidModuleId` é erro de compilação, garantindo a
 * invariante "toda landing page é um moduleId válido" em compile-time.
 */
export type LandingPage = Extract<
  ValidModuleId,
  | 'dashboards-commercial'
  | 'dashboards-support'
  | 'dashboards-marketing'
  | 'crm'
  | 'chat'
  | 'tickets'
  | 'calendar'
  | 'contacts'
>;

/**
 * Default usado pelo frontend quando `Level.landingPage` é undefined.
 * Backend redirect handler também deve referenciar essa constante (Phase 2).
 */
export const DEFAULT_LANDING_PAGE: LandingPage = 'dashboards-support';

export interface Level extends FullTenantDocument {
  name: string; // "Administrador", "Gerente", "Operador"
  description?: string;
  permissions: Record<string, ModulePermission>; // moduleId -> permissions
  landingPage?: LandingPage;
  status: ActiveStatus;
}

// Generic + Specific Pattern
export interface LevelQuery extends PaginationQuery {
  status?: ActiveStatus;
  name?: string;
}

export interface LevelResponse {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, ModulePermission>;
  landingPage?: LandingPage;
  companyId: string;
  appId: string;
  status: ActiveStatus;
  createdAt: string;
  updatedAt: string;
}
export interface LevelListResponse extends ListResponse<LevelResponse> {}
export interface LevelQueryOptions extends GenericQueryOptions<LevelQuery> {}

// Request types
export interface CreateLevelRequest {
  name: string;
  description?: string;
  permissions: Record<string, ModulePermission>;
  landingPage?: LandingPage;
}

export interface UpdateLevelRequest {
  name?: string;
  description?: string;
  permissions?: Record<string, ModulePermission>;
  landingPage?: LandingPage;
  status?: ActiveStatus;
}
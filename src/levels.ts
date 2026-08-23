import { ObjectId } from 'mongodb';
import { FullTenantDocument, ActiveStatus, PaginationQuery, GenericQueryOptions, ListResponse } from './common';
import { ModulePermission, ValidModuleId } from './modules';

/**
 * Telas iniciais que correspondem 1:1 a um módulo do catálogo.
 *
 * Validação backend: se definida, o Level precisa ter permission `read` no
 * módulo de mesmo nome (mesmo request) — `validateLandingPageCoherence`.
 *
 * Tipo derivado de `ValidModuleId` via `Extract<>` — adicionar um valor aqui
 * que não exista em `ValidModuleId` é erro de compilação, garantindo a
 * invariante "toda landing page de módulo é um moduleId válido".
 */
export type ModuleLandingPage = Extract<
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
 * Telas iniciais de rota LIVRE — não têm módulo correspondente porque a rota
 * não exige permissão de módulo, por decisão de produto.
 *
 * `checklists-my` = "Meus checklists" (`/checklists/my`), a caixa de entrada
 * do responsável pelo checklist. A rota é `app+auth` no backend
 * (`checklists/router.ts`) e o item de menu é deliberadamente livre no
 * Sidebar, justamente porque a persona típica — gerente de loja — NÃO tem
 * `checklists:read` (que é permissão de gestão e abre o tenant inteiro).
 * Sem esta exceção, um nível de gerente ficaria sem tela inicial válida e
 * cairia no default `dashboards-support`, que hoje não checa permissão.
 *
 * Consequência para quem for adicionar um valor aqui: `landingPage` deixa de
 * ser garantidamente um moduleId, então todo consumidor que assume essa
 * equivalência precisa passar por `isFreeLandingPage` antes.
 */
export const FREE_LANDING_PAGES = ['checklists-my'] as const;

export type FreeLandingPage = (typeof FREE_LANDING_PAGES)[number];

/**
 * Telas iniciais ALIAS — rotas que pertencem a um módulo existente mas não
 * têm id próprio no catálogo. A permissão validada é a do módulo DONO.
 *
 * `crm-seller` = "Dashboard do vendedor" (`/crm/seller`), dentro do módulo
 * `crm` (D10: quem tem `crm:read` vê o dashboard; sem módulo novo).
 */
export const ALIAS_LANDING_PAGES = {
  'crm-seller': 'crm',
} as const satisfies Record<string, ModuleLandingPage>;

export type AliasLandingPage = keyof typeof ALIAS_LANDING_PAGES;

export type LandingPage = ModuleLandingPage | FreeLandingPage | AliasLandingPage;

/** `true` quando a tela inicial é um alias de módulo (ex.: `crm-seller` → `crm`). */
export const isAliasLandingPage = (value: LandingPage): value is AliasLandingPage =>
  Object.prototype.hasOwnProperty.call(ALIAS_LANDING_PAGES, value);

/** `true` quando a tela inicial não tem módulo para validar permissão. */
export const isFreeLandingPage = (value: LandingPage): value is FreeLandingPage =>
  (FREE_LANDING_PAGES as readonly string[]).includes(value);

/**
 * Módulo cuja permissão `read` a tela inicial exige.
 * - rota livre → `null` (nada a validar)
 * - alias → módulo dono (`ALIAS_LANDING_PAGES`)
 * - demais → o próprio valor (é um `ValidModuleId`)
 *
 * ÚNICO ponto que traduz tela inicial → módulo. Backend
 * (`validateLandingPageCoherence`) e frontend (`LevelFormPage`) consomem daqui
 * — nunca assumir `landingPage === moduleId`.
 */
export const resolveLandingPageModule = (landingPage: LandingPage): ValidModuleId | null => {
  if (isFreeLandingPage(landingPage)) return null;
  if (isAliasLandingPage(landingPage)) return ALIAS_LANDING_PAGES[landingPage];
  return landingPage;
};

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
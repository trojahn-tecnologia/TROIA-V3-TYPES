"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LANDING_PAGE = exports.resolveLandingPageModule = exports.isFreeLandingPage = exports.isAliasLandingPage = exports.ALIAS_LANDING_PAGES = exports.FREE_LANDING_PAGES = void 0;
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
exports.FREE_LANDING_PAGES = ['checklists-my'];
/**
 * Telas iniciais ALIAS — rotas que pertencem a um módulo existente mas não
 * têm id próprio no catálogo. A permissão validada é a do módulo DONO.
 *
 * `crm-seller` = "Dashboard do vendedor" (`/crm/seller`), dentro do módulo
 * `crm` (D10: quem tem `crm:read` vê o dashboard; sem módulo novo).
 */
exports.ALIAS_LANDING_PAGES = {
    'crm-seller': 'crm',
};
/** `true` quando a tela inicial é um alias de módulo (ex.: `crm-seller` → `crm`). */
const isAliasLandingPage = (value) => Object.prototype.hasOwnProperty.call(exports.ALIAS_LANDING_PAGES, value);
exports.isAliasLandingPage = isAliasLandingPage;
/** `true` quando a tela inicial não tem módulo para validar permissão. */
const isFreeLandingPage = (value) => exports.FREE_LANDING_PAGES.includes(value);
exports.isFreeLandingPage = isFreeLandingPage;
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
const resolveLandingPageModule = (landingPage) => {
    if ((0, exports.isFreeLandingPage)(landingPage))
        return null;
    if ((0, exports.isAliasLandingPage)(landingPage))
        return exports.ALIAS_LANDING_PAGES[landingPage];
    return landingPage;
};
exports.resolveLandingPageModule = resolveLandingPageModule;
/**
 * Default usado pelo frontend quando `Level.landingPage` é undefined.
 * Backend redirect handler também deve referenciar essa constante (Phase 2).
 */
exports.DEFAULT_LANDING_PAGE = 'dashboards-support';

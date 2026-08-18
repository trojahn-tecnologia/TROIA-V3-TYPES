"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LANDING_PAGE = exports.isFreeLandingPage = exports.FREE_LANDING_PAGES = void 0;
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
/** `true` quando a tela inicial não tem módulo para validar permissão. */
const isFreeLandingPage = (value) => exports.FREE_LANDING_PAGES.includes(value);
exports.isFreeLandingPage = isFreeLandingPage;
/**
 * Default usado pelo frontend quando `Level.landingPage` é undefined.
 * Backend redirect handler também deve referenciar essa constante (Phase 2).
 */
exports.DEFAULT_LANDING_PAGE = 'dashboards-support';

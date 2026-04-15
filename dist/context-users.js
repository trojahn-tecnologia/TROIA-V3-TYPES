"use strict";
/**
 * Context Users — Shared Enums
 *
 * Os 3 módulos independentes (`channels-users`, `funnels-users`,
 * `ticket-pipelines-users`) compartilham os mesmos enums de `role` e `scope`
 * para que a semântica de atribuição e privacidade seja idêntica nos 3
 * contextos. Cada módulo define sua própria interface (com `channelId`,
 * `funnelId` ou `pipelineId`) — não existe abstração base comum.
 *
 * Ver plano completo: DOCS/architecture/ASSIGNMENTS_REMOVAL.md
 */
Object.defineProperty(exports, "__esModule", { value: true });

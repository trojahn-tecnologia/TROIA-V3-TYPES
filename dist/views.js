"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIEW_PROVIDER_IDS = void 0;
/**
 * Fontes de visita reconhecidas. Coincidem por desenho com os valores de
 * `ProviderId` da categoria `views` — o mesmo slug dos dois lados faz a chave
 * de dedupe ser idêntica, então trocar o caminho de ingestão (ex.: coletor
 * externo → provider nativo) faz upsert em cima do histórico em vez de duplicá-lo.
 */
exports.VIEW_PROVIDER_IDS = [
    'views-best-flow',
    'views-google-analytics',
    'views-troia-tracker',
    'views-api',
];

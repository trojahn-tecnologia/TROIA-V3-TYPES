"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGENT_SEGMENT_LABELS = exports.AGENT_CATEGORY_LABELS = exports.AgentSegment = exports.AgentCategory = void 0;
/**
 * Categoria funcional do agente — descreve O QUE ele FAZ.
 *
 * Usada pela tab "Treinar Agente" (Sprint UI-2) para filtrar cenários
 * de teste relevantes: um agente SDR é testado com cenários de
 * qualificação/agendamento, um agente SUPORTE com abertura de tickets, etc.
 *
 * Combina com `AgentSegment` (indústria) pra matriz de especialização.
 */
var AgentCategory;
(function (AgentCategory) {
    AgentCategory["SDR"] = "sdr";
    AgentCategory["ATTENDANT"] = "attendant";
    AgentCategory["SUPPORT"] = "support";
    AgentCategory["FINANCIAL"] = "financial";
    AgentCategory["SALES"] = "sales";
    AgentCategory["SCHEDULING"] = "scheduling";
    AgentCategory["OTHER"] = "other";
})(AgentCategory || (exports.AgentCategory = AgentCategory = {}));
/**
 * Segmento de mercado do agente — descreve PRA QUAL indústria ele atende.
 *
 * Combina com `AgentCategory` (função) pra matriz de testes: um agente
 * "SDR de imobiliária" recebe cenários diferentes de um "SDR de SaaS".
 */
var AgentSegment;
(function (AgentSegment) {
    AgentSegment["EDUCATIONAL"] = "educational";
    AgentSegment["REAL_ESTATE"] = "real_estate";
    AgentSegment["HEALTHCARE"] = "healthcare";
    AgentSegment["ECOMMERCE"] = "ecommerce";
    AgentSegment["SERVICES"] = "services";
    AgentSegment["SAAS"] = "saas";
    AgentSegment["ACCOUNTING"] = "accounting";
    AgentSegment["LAW"] = "law";
    AgentSegment["FOOD"] = "food";
    AgentSegment["AUTOMOTIVE"] = "automotive";
    AgentSegment["SOLAR_ENERGY"] = "solar_energy";
    AgentSegment["APPAREL"] = "apparel";
    AgentSegment["GENERIC"] = "generic";
})(AgentSegment || (exports.AgentSegment = AgentSegment = {}));
/**
 * Metadata de configuração pra tabela "amigável" de categorias/segmentos
 * exibida no form do agente. Mantida aqui pra ser single source of truth.
 */
exports.AGENT_CATEGORY_LABELS = {
    [AgentCategory.SDR]: 'SDR (Prospecção)',
    [AgentCategory.ATTENDANT]: 'Atendente',
    [AgentCategory.SUPPORT]: 'Suporte Técnico',
    [AgentCategory.FINANCIAL]: 'Financeiro',
    [AgentCategory.SALES]: 'Vendas',
    [AgentCategory.SCHEDULING]: 'Agendamento',
    [AgentCategory.OTHER]: 'Outro',
};
exports.AGENT_SEGMENT_LABELS = {
    [AgentSegment.EDUCATIONAL]: 'Educacional',
    [AgentSegment.REAL_ESTATE]: 'Imobiliária',
    [AgentSegment.HEALTHCARE]: 'Saúde',
    [AgentSegment.ECOMMERCE]: 'E-commerce',
    [AgentSegment.SERVICES]: 'Serviços',
    [AgentSegment.SAAS]: 'SaaS / Software',
    [AgentSegment.ACCOUNTING]: 'Contabilidade',
    [AgentSegment.LAW]: 'Advocacia',
    [AgentSegment.FOOD]: 'Alimentação',
    [AgentSegment.AUTOMOTIVE]: 'Automotivo',
    [AgentSegment.SOLAR_ENERGY]: 'Energia Solar',
    [AgentSegment.APPAREL]: 'Confecção',
    [AgentSegment.GENERIC]: 'Genérico',
};

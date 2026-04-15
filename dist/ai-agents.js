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
    AgentCategory["ATENDENTE"] = "atendente";
    AgentCategory["SUPORTE"] = "suporte";
    AgentCategory["FINANCEIRO"] = "financeiro";
    AgentCategory["VENDAS"] = "vendas";
    AgentCategory["AGENDAMENTO"] = "agendamento";
    AgentCategory["OUTRO"] = "outro";
})(AgentCategory || (exports.AgentCategory = AgentCategory = {}));
/**
 * Segmento de mercado do agente — descreve PRA QUAL indústria ele atende.
 *
 * Combina com `AgentCategory` (função) pra matriz de testes: um agente
 * "SDR de imobiliária" recebe cenários diferentes de um "SDR de SaaS".
 */
var AgentSegment;
(function (AgentSegment) {
    AgentSegment["EDUCACIONAL"] = "educacional";
    AgentSegment["IMOBILIARIA"] = "imobiliaria";
    AgentSegment["SAUDE"] = "saude";
    AgentSegment["ECOMMERCE"] = "ecommerce";
    AgentSegment["SERVICOS"] = "servicos";
    AgentSegment["SAAS"] = "saas";
    AgentSegment["CONTABILIDADE"] = "contabilidade";
    AgentSegment["ADVOCACIA"] = "advocacia";
    AgentSegment["ALIMENTACAO"] = "alimentacao";
    AgentSegment["AUTOMOTIVO"] = "automotivo";
    AgentSegment["ENERGIA_SOLAR"] = "energia-solar";
    AgentSegment["CONFECCAO"] = "confeccao";
    AgentSegment["GENERICO"] = "generico";
})(AgentSegment || (exports.AgentSegment = AgentSegment = {}));
/**
 * Metadata de configuração pra tabela "amigável" de categorias/segmentos
 * exibida no form do agente. Mantida aqui pra ser single source of truth.
 */
exports.AGENT_CATEGORY_LABELS = {
    [AgentCategory.SDR]: 'SDR (Prospecção)',
    [AgentCategory.ATENDENTE]: 'Atendente',
    [AgentCategory.SUPORTE]: 'Suporte Técnico',
    [AgentCategory.FINANCEIRO]: 'Financeiro',
    [AgentCategory.VENDAS]: 'Vendas',
    [AgentCategory.AGENDAMENTO]: 'Agendamento',
    [AgentCategory.OUTRO]: 'Outro',
};
exports.AGENT_SEGMENT_LABELS = {
    [AgentSegment.EDUCACIONAL]: 'Educacional',
    [AgentSegment.IMOBILIARIA]: 'Imobiliária',
    [AgentSegment.SAUDE]: 'Saúde',
    [AgentSegment.ECOMMERCE]: 'E-commerce',
    [AgentSegment.SERVICOS]: 'Serviços',
    [AgentSegment.SAAS]: 'SaaS / Software',
    [AgentSegment.CONTABILIDADE]: 'Contabilidade',
    [AgentSegment.ADVOCACIA]: 'Advocacia',
    [AgentSegment.ALIMENTACAO]: 'Alimentação',
    [AgentSegment.AUTOMOTIVO]: 'Automotivo',
    [AgentSegment.ENERGIA_SOLAR]: 'Energia Solar',
    [AgentSegment.CONFECCAO]: 'Confecção',
    [AgentSegment.GENERICO]: 'Genérico',
};

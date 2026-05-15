"use strict";
/**
 * Catálogo central de métricas (evaluators) do sistema de qualidade dos
 * agentes IA — sistema interno em MongoDB pós-migração Langfuse
 * (2026-05-11/12, ver `@DOCS/modules/EVALUATORS_INTERNAL.md`).
 *
 * Single source of truth pro frontend (labels/tooltips) e pro backend
 * (prompts do Coach, deploy gate, relatórios). Atualizar AQUI quando criar
 * ou renomear métrica — tier e pesos vivem nos YAMLs em
 * `TROIA-V3-BACKEND/src/modules/evaluators/templates/`.
 *
 * Convenções:
 *   • Chaves canônicas em **camelCase** (formato do
 *     `summary.averages.*` no backend e do response do agent-analytics).
 *     Aliases snake_case e legacy são reconhecidos via `normalizeEvaluatorName`.
 *   • Labels em pt-BR pensados pra **leigo**: "Honestidade" em vez de
 *     "Transparência factual", "Tempo de resposta" em vez de
 *     "Latência (vs SLA)".
 *   • Descrições explicam o QUE mede e POR QUE importa, não COMO mede.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVALUATOR_TIER = exports.QUALITY_TEST_EVALUATORS = exports.EVALUATOR_DESCRIPTIONS = exports.EVALUATOR_LABELS = void 0;
exports.normalizeEvaluatorName = normalizeEvaluatorName;
exports.getEvaluatorLabel = getEvaluatorLabel;
exports.getEvaluatorDescription = getEvaluatorDescription;
exports.EVALUATOR_LABELS = {
    faithfulness: 'Confiabilidade das informações',
    goalAccuracy: 'Cumprimento do objetivo',
    toolUsage: 'Uso de ferramentas',
    scopeAdherence: 'Foco no escopo',
    humanization: 'Tom natural',
    actionCompleteness: 'Execução das ações',
    latencyBudget: 'Tempo de resposta',
    transparency: 'Honestidade',
    presentTense: 'Fala no presente',
    precision: 'Precisão factual',
    resolution: 'Resolução do problema',
    clarityEmpathy: 'Clareza e empatia',
};
exports.EVALUATOR_DESCRIPTIONS = {
    faithfulness: 'Quando o agente afirma um preço, prazo ou característica, ele está se baseando em informação real (base de conhecimento) ou inventou? Quanto maior, mais confiável.',
    goalAccuracy: 'O agente está conduzindo a conversa em direção ao objetivo dele (qualificar, agendar, responder dúvida, encaminhar)? Quanto maior, mais focado.',
    toolUsage: 'O agente usou as ferramentas certas no momento certo (buscar na base, criar lead, transferir, etc.)? Penaliza quando o agente "esquece" de buscar antes de responder.',
    scopeAdherence: 'O agente respeitou as regras e o escopo definidos no prompt? Penaliza desvios para assuntos fora do contexto que ele foi treinado pra atender.',
    humanization: 'A resposta soa natural, como uma pessoa escreveria? Penaliza narração interna ("vou buscar...", "deixa eu pensar...") ou texto técnico/robótico.',
    actionCompleteness: 'Em cenários de teste com ações esperadas, o agente chamou todas as ferramentas que se esperava? Mede execução completa, não só intenção.',
    latencyBudget: 'Mede o tempo total de resposta comparado ao tempo aceitável (SLA padrão: 10s). 100% quando responde abaixo do SLA, cai linearmente até 0% quando demora o dobro. A latência inclui o tempo do modelo de IA + chamadas de ferramentas (busca, RAG, etc.).',
    transparency: 'Quando o agente não sabe a resposta, ele admite (e oferece transferir, buscar, etc.) ou inventa? Penaliza afirmar fatos sem ter base.',
    presentTense: 'O agente fala apenas no presente, sem prometer ações futuras que não pode cumprir. Frases como "vou confirmar", "só um instante", "te falo já já", "te dou retorno" são falsas — o agente só responde quando o cliente envia uma nova mensagem, então qualquer promessa de retorno futuro engana o cliente.',
    precision: 'Em conversas reais que foram fechadas: as informações que o agente passou ao cliente estavam corretas?',
    resolution: 'Em conversas reais que foram fechadas: o problema do cliente foi resolvido ou avançou pro destino certo (transferido, agendado, qualificado)?',
    clarityEmpathy: 'Em conversas reais que foram fechadas: o agente foi claro nas explicações e demonstrou empatia ao longo da conversa?',
};
/**
 * Métricas que SEMPRE pontuam num snapshot de quality test
 * (`agent_training` trace). Tier 1 LLM em cima, Tier 2 determinístico
 * embaixo. Tier 3 (`precision`/`resolution`/`clarityEmpathy`) NÃO entra
 * aqui — só pontua em conversas reais fechadas.
 */
exports.QUALITY_TEST_EVALUATORS = [
    'faithfulness',
    'goalAccuracy',
    'toolUsage',
    'scopeAdherence',
    'actionCompleteness',
    'humanization',
    'latencyBudget',
    'transparency',
    'presentTense',
];
/**
 * Tier por evaluator — Tier 1 (LLM judge) tem peso 60% no health score,
 * Tier 2 (determinístico) 25%, Tier 3 (LLM em conversa fechada) 15%.
 * Renormalização aplicada quando faltam scores de algum tier.
 */
exports.EVALUATOR_TIER = {
    faithfulness: 1,
    goalAccuracy: 1,
    toolUsage: 1,
    scopeAdherence: 1,
    actionCompleteness: 1,
    presentTense: 1,
    transparency: 1,
    humanization: 2,
    latencyBudget: 2,
    precision: 3,
    resolution: 3,
    clarityEmpathy: 3,
};
/**
 * Aliases snake_case e legacy → chave canônica camelCase.
 * O backend (`agent-scores.evaluatorName`) emite snake_case, o frontend
 * usa camelCase. Snapshots antigos podem trazer `agentGoalAccuracy`
 * (nome Langfuse v6 da Onda 1, deprecated).
 */
const EVALUATOR_ALIASES = {
    goal_accuracy: 'goalAccuracy',
    agent_goal_accuracy: 'goalAccuracy',
    agentGoalAccuracy: 'goalAccuracy',
    tool_usage: 'toolUsage',
    scope_adherence: 'scopeAdherence',
    action_completeness: 'actionCompleteness',
    latency_budget: 'latencyBudget',
    present_tense: 'presentTense',
    clarity_empathy: 'clarityEmpathy',
};
/**
 * Normaliza nome de evaluator (snake_case, alias legacy) → chave canônica
 * camelCase. Retorna `null` se desconhecido — caller decide fallback.
 */
function normalizeEvaluatorName(name) {
    if (name in exports.EVALUATOR_LABELS)
        return name;
    const alias = EVALUATOR_ALIASES[name];
    return alias ?? null;
}
/**
 * Retorna label de exibição para uma métrica. Reconhece snake_case e
 * aliases legacy. Para nome desconhecido (backend introduziu métrica nova
 * sem atualizar este catálogo), gera fallback "Title Case" a partir do
 * nome técnico — nunca exibe o nome cru pro usuário.
 */
function getEvaluatorLabel(name) {
    const canonical = normalizeEvaluatorName(name);
    if (canonical)
        return exports.EVALUATOR_LABELS[canonical];
    return name
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
}
/**
 * Retorna descrição explicativa da métrica (tooltips, popovers). Vazio
 * quando a métrica não tem descrição catalogada.
 */
function getEvaluatorDescription(name) {
    const canonical = normalizeEvaluatorName(name);
    if (!canonical)
        return '';
    return exports.EVALUATOR_DESCRIPTIONS[canonical];
}

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
export type EvaluatorName = 'faithfulness' | 'goalAccuracy' | 'toolUsage' | 'scopeAdherence' | 'humanization' | 'actionCompleteness' | 'latencyBudget' | 'transparency' | 'presentTense';
export declare const EVALUATOR_LABELS: Record<EvaluatorName, string>;
export declare const EVALUATOR_DESCRIPTIONS: Record<EvaluatorName, string>;
/**
 * Métricas que SEMPRE pontuam num snapshot de quality test
 * (`agent_training` trace). Tier 1 LLM em cima, Tier 2 determinístico
 * embaixo.
 */
export declare const QUALITY_TEST_EVALUATORS: ReadonlyArray<EvaluatorName>;
/**
 * Tier por evaluator — Tier 1 (LLM judge) tem peso 60% no health score,
 * Tier 2 (determinístico) 25%.
 * Renormalização aplicada quando faltam scores de algum tier.
 */
export declare const EVALUATOR_TIER: Record<EvaluatorName, 1 | 2>;
/**
 * Normaliza nome de evaluator (snake_case, alias legacy) → chave canônica
 * camelCase. Retorna `null` se desconhecido — caller decide fallback.
 */
export declare function normalizeEvaluatorName(name: string): EvaluatorName | null;
/**
 * Retorna label de exibição para uma métrica. Reconhece snake_case e
 * aliases legacy. Para nome desconhecido (backend introduziu métrica nova
 * sem atualizar este catálogo), gera fallback "Title Case" a partir do
 * nome técnico — nunca exibe o nome cru pro usuário.
 */
export declare function getEvaluatorLabel(name: string): string;
/**
 * Retorna descrição explicativa da métrica (tooltips, popovers). Vazio
 * quando a métrica não tem descrição catalogada.
 */
export declare function getEvaluatorDescription(name: string): string;

/**
 * Agent Analytics API Response Types
 *
 * These types are used by the agent-analytics module in the backend
 * and consumed by the frontend for dashboards and analytics views.
 *
 * Added in 2026-05-11: optional fields `partial`, `availableTiers`, `pendingEvaluators`, `langfusePath`
 * for internal evaluators migration and async processing support.
 */
export type AnalyticsPeriod = '1d' | '7d' | '30d' | '90d';
/**
 * Resposta de score de saúde agregado do agente.
 *
 * **Novos campos (2026-05-11)**:
 * - `partial`: true quando apenas alguns Tiers de evaluators rodaram
 *   (ex: tenant sem provider de LLM — Tier 1 pulado)
 * - `availableTiers`: quais tiers realmente contribuíram com scores
 */
export interface AgentHealthScoreResponse {
    agentId: string;
    period: AnalyticsPeriod;
    /** Score agregado 0-1 (média ponderada dos evaluators principais) */
    overallScore: number;
    /** Breakdown por evaluator (se houver scores) — 13 evaluators v6.1 (com action_completeness) */
    components: {
        agentGoalAccuracy?: number;
        faithfulness?: number;
        hallucination?: number;
        conversationAdvancement?: number;
        /** v6.1: score binário determinístico emitido pelo evaluator action_completeness.yaml. */
        actionCompleteness?: number;
        toolUsage?: number;
        scopeAdherence?: number;
        knowledgeRetention?: number;
        answerCompleteness?: number;
        relevance?: number;
        humanization?: number;
        conciseness?: number;
        tone?: number;
    };
    /** Total de traces considerados no cálculo */
    traceCount: number;
    /** Se o tenant não tem evaluators configurados, retorna null */
    hasEvaluators: boolean;
    /**
     * NEW (2026-05-11): true quando apenas alguns Tiers rodaram (tenant sem LLM provider).
     * Scores retornados refletem apenas os Tiers que conseguiram rodar.
     */
    partial?: boolean;
    /**
     * NEW (2026-05-11): lista de números de tiers que contribuíram scores.
     * Ex: [1, 3] = Tier 1 (LLM) e Tier 3 (regras) rodaram; Tier 2 (guardrails) pulado.
     * Presente apenas se `partial: true`.
     */
    availableTiers?: (1 | 2 | 3)[];
}
/**
 * Item individual na listagem de traces do agente.
 *
 * **Novos campos (2026-05-11)**:
 * - `pendingEvaluators`: lista de nomes de evaluators ainda sendo processados (Tier 1 async)
 * - `langfusePath`: explicitamente nullable agora — backend pode retornar null se não publicado
 */
export interface AgentTraceSummary {
    traceId: string;
    timestamp: string;
    sessionId: string;
    /** Snippet do output do agente (primeiros 200 chars) */
    outputSnippet: string;
    /** Modelo usado na execução (extraído de trace.metadata.model) */
    model: string | null;
    /** Score médio dos evaluators (0-1) se houver, null se não tem score */
    averageScore: number | null;
    /** Custo em USD */
    costUsd: number;
    /** Latência em segundos */
    latencySeconds: number;
    /** Tags do trace */
    tags: string[];
    /**
     * NEW (2026-05-11): nomes de evaluators ainda sendo processados.
     * Presente quando o trace foi criado mas scores Tier 1 (async LLM) ainda não completaram.
     * Quando o array fica vazio, score está completo.
     */
    pendingEvaluators?: string[];
    /**
     * NEW (2026-05-11): link direto para o trace no Langfuse UI.
     * Agora explicitamente `string | null` para suportar casos onde o trace
     * ainda não foi publicado ao Langfuse (integração ainda em boot).
     * Anteriormente era implicitamente `string`.
     */
    langfusePath?: string | null;
}
export interface AgentTracesListResponse {
    items: AgentTraceSummary[];
    total: number;
    page: number;
    limit: number;
}
/**
 * Resposta detalhada de um trace individual.
 * Inclui input/output completo, observações, scores de todos os evaluators.
 */
export interface AgentTraceDetailResponse {
    traceId: string;
    timestamp: string;
    sessionId: string;
    name: string;
    input: unknown;
    output: unknown;
    tags: string[];
    metadata: Record<string, unknown> | null;
    costUsd: number;
    latencySeconds: number;
    scores: Array<{
        name: string;
        value: number;
        comment: string | null;
        source: string;
    }>;
    observations: Array<{
        id: string;
        type: string;
        name: string;
        startTime: string;
        endTime: string | null;
        model: string | null;
        inputTokens: number | null;
        outputTokens: number | null;
        costUsd: number | null;
        latencySeconds: number | null;
    }>;
    /** Link direto no Langfuse UI */
    langfusePath: string;
}
export interface AgentScoresResponse {
    agentId: string;
    period: AnalyticsPeriod;
    /** Score agregado por métrica (ex: relevance, hallucination, tone, tool_usage) */
    byMetric: Record<string, {
        average: number;
        count: number;
        min: number;
        max: number;
    }>;
    /** Total de scores coletados no período */
    totalScores: number;
}
export interface AgentMetricsResponse {
    agentId: string;
    agentName: string;
    period: AnalyticsPeriod;
    /** Total de execuções do agente no período */
    totalExecutions: number;
    /** Custo total em USD no período */
    totalCostUsd: number;
    /** Latência média em segundos */
    avgLatencySeconds: number;
    /** p95 de latência em segundos */
    p95LatencySeconds: number;
    /** Quantidade de execuções que chamaram ao menos 1 tool */
    executionsWithTools: number;
    /** Quantas conversas distintas (sessions) foram atendidas no período */
    distinctSessions: number;
    /** Timestamp do início do período */
    from: string;
    /** Timestamp do fim do período */
    to: string;
}
export interface AgentCostBreakdownResponse {
    agentId: string;
    period: AnalyticsPeriod;
    /** Custo total em USD (calculado via Langfuse totalCost) */
    totalUsd: number;
    /** Total de créditos consumidos no período (input + output) */
    totalCredits: number;
    /** Créditos de tokens de entrada */
    totalInputCredits: number;
    /** Créditos de tokens de saída */
    totalOutputCredits: number;
    /** Série temporal por dia */
    byDay: Array<{
        date: string;
        costUsd: number;
        executions: number;
    }>;
    /** Breakdown por modelo — créditos reais debitados (credit-transactions) */
    byModel: Array<{
        model: string;
        costUsd: number;
        executions: number;
        inputCredits: number;
        outputCredits: number;
    }>;
}
export interface KnowledgeGapPattern {
    gapKey: string;
    pattern: string;
    label: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
    samples: Array<{
        traceId: string;
        timestamp: string;
        sessionId: string;
        /** Trecho do output do agente (até 200 chars). */
        snippet: string;
        /**
         * Mensagem mais recente do cliente que originou a resposta do agente,
         * truncada a 200 chars. Adicionado em 2026-05-13 pra contextualizar
         * o gap na UI (sem isso o admin não consegue distinguir transferência
         * legítima de transferência inadequada).
         */
        customerMessage?: string;
    }>;
    isResolved: boolean;
    previouslyResolved: boolean;
    samplesAfterResolution: number;
    resolution?: {
        resolvedAt: string;
        resolvedBy: string;
        databaseDocumentId?: string;
        databaseId?: string;
        note?: string;
        databaseDocumentMissing?: boolean;
    };
}
export interface AgentKnowledgeGapsResponse {
    agentId: string;
    period: AnalyticsPeriod;
    patterns: KnowledgeGapPattern[];
    totalOccurrences: number;
    resolvedCount: number;
}
export interface HealthTrendPoint {
    date: string;
    overallScore: number | null;
    traceCount: number;
}
export interface AgentHealthTrendsResponse {
    agentId: string;
    period: AnalyticsPeriod;
    points: HealthTrendPoint[];
    hasEvaluators: boolean;
}
export interface FabricationSample {
    traceId: string;
    timestamp: string;
    comment: string | null;
}
export interface AgentFabricationStatsResponse {
    agentId: string;
    period: AnalyticsPeriod;
    totalScored: number;
    fabricatedCount: number;
    cleanCount: number;
    fabricationRate: number;
    recentFabrications: FabricationSample[];
    hasScore: boolean;
}
export type InsightCategory = 'positive' | 'improvement' | 'insight';
export interface AgentInsight {
    category: InsightCategory;
    title: string;
    description: string;
    relatedMetrics?: string[];
}
export interface AgentInsightsResponse {
    agentId: string;
    period: AnalyticsPeriod;
    insights: AgentInsight[];
    generatedAt: string;
}

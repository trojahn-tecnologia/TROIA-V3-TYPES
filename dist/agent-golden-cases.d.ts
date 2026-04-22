/**
 * Golden case gerado a partir de uma conversa real marcada como EXCELENTE.
 *
 * O caso é uma REFERÊNCIA LIVE (guarda apenas conversationId) — os turnos
 * do cliente e as respostas do agente são extraídos do Mongo
 * (`conversation-messages`) em cada run. Se a conversa for deletada ou
 * truncada, o caso vira inválido e é filtrado pelo runner.
 */
export interface AgentGoldenCase {
    id: string;
    appId: string;
    companyId: string;
    agentId: string;
    conversationId: string;
    markedByUserId: string;
    markedAt: string;
    /** Nullable — quando usuário desmarca, entra aqui como soft-delete */
    unmarkedAt?: string | null;
    unmarkedByUserId?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface AgentGoldenCaseResponse extends AgentGoldenCase {
}
/**
 * Request pro endpoint `POST /agent-golden-cases/:conversationId/mark`.
 * Conversation deve estar em tenant do chamador e ter `agentId` setado.
 */
export interface MarkConversationAsGoldenRequest {
    /**
     * Opcional — se omitido, o backend busca `conversation.agentId`.
     * Exposto só pra permitir casos onde o frontend já sabe e quer
     * economizar lookup.
     */
    agentId?: string;
}
/**
 * Saída do comparison de 1 golden case vs prompt novo.
 */
export interface GoldenCaseTurnComparison {
    turnIndex: number;
    customerMessage: string;
    expectedAgentResponse: string;
    actualAgentResponse: string;
    cosineSimilarity: number;
}
export interface GoldenCaseComparison {
    goldenCaseId: string;
    conversationId: string;
    totalTurns: number;
    averageSimilarity: number;
    passed: boolean;
    turns: GoldenCaseTurnComparison[];
    /** Preenchido quando o run desse caso falhou (conversa inválida, etc.) */
    errorReason?: string;
}
/**
 * Nova seção agregada em TestBeforeDeployComparisonResponse.
 *
 * `null` quando o agente não tem nenhum golden case ativo (fluxo normal
 * ainda roda cenários sintéticos; golden é sinal COMPLEMENTAR).
 */
export interface GoldenSignal {
    totalCases: number;
    passedCases: number;
    passRate: number;
    averageSimilarity: number;
    threshold: number;
    cases: GoldenCaseComparison[];
}

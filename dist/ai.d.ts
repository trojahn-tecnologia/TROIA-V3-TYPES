/**
 * Supported AI providers for agent execution
 * These are the providers that support AI_TEXT_GENERATION and AI_CHAT_COMPLETION capabilities
 */
export type AIProviderType = 'openai' | 'anthropic' | 'xai' | 'google' | 'mistral' | 'deepseek' | 'zai';
/**
 * OpenAI Provider Config - APENAS API Key necessário
 * Modelo e dimensions são fixados dentro do OpenAIProvider
 */
export interface OpenAIConfig {
    apiKey: string;
}
/**
 * Cohere Provider Config
 * Future AI provider for embeddings
 */
export interface CohereConfig {
    apiKey: string;
    model?: string;
}
/**
 * Anthropic Provider Config
 * For Claude models (Claude 3, Claude 3.5, etc.)
 */
export interface AnthropicConfig {
    apiKey: string;
}
/**
 * HuggingFace Provider Config
 * Future AI provider for embeddings
 */
export interface HuggingFaceConfig {
    apiKey: string;
    model: string;
}
/**
 * Union type for all AI Provider Configs
 */
export type AIProviderConfig = OpenAIConfig | AnthropicConfig | CohereConfig | HuggingFaceConfig;
/**
 * Features suportadas por um modelo de IA
 * Diferente de AIAgentCapability (que são features do agente, não do modelo)
 */
export type AIModelFeature = 'pdf' | 'image' | 'tools' | 'reasoning';
/**
 * Definição completa de um modelo de IA
 * Single source of truth para metadados de todos os modelos suportados
 */
export interface AIModelDefinition {
    /** ID enviado à API do provider (ex: 'gpt-4.1-mini') */
    id: string;
    /** Nome exibido no frontend (ex: 'GPT-4.1 Mini') */
    name: string;
    /** Provider que serve este modelo */
    provider: AIProviderType;
    /** Features que o modelo suporta nativamente */
    features: AIModelFeature[];
    /** Frase curta de destaque para exibir no select */
    highlight: string;
    /** Preços em USD por 1M tokens */
    pricing: {
        input: number;
        output: number;
    };
    /** Máx tokens de contexto (input) — valor real da API */
    contextWindow: number;
    /** Máx tokens de saída — valor real da API */
    maxOutputTokens: number;
    /** Modelo legado mantido para retrocompatibilidade */
    deprecated?: boolean;
    /**
     * Para que serve o modelo.
     *
     * `'agent'` (padrão) = conversa com o cliente. `'judge'` = só verificação
     * interna (conformidade, avaliação) — não aparece no seletor "Modelo de IA"
     * do agente, porque não é modelo de conversa.
     *
     * Nasceu com o `gpt-oss-safeguard-20b`, que é treinado para ler uma política
     * e dar veredito, não para atender ninguém.
     */
    purpose?: 'agent' | 'judge';
    /**
     * Slug deste MESMO modelo no Vercel AI Gateway (ex: `openai/gpt-4.1-mini`).
     *
     * **Ausente = não roteia pelo gateway.** O modelo continua sendo servido
     * pela integração direta do provider de origem. É o caso de
     * `deepseek-chat`/`deepseek-reasoner` (apelidos da API própria da DeepSeek,
     * sem equivalente no gateway) e dos modelos legados do Gemini 1.5.
     *
     * O `id` acima NUNCA muda: é ele que está gravado nos 127 agentes, nas
     * linhas de custo em `apps.costs[]` e no select "Modelo de IA". O slug é
     * só o endereço do mesmo modelo no transporte alternativo.
     *
     * Conferidos um a um contra `https://ai-gateway.vercel.sh/v1/models`
     * em 25/08/2026 — atenção ao Anthropic, que usa PONTO
     * (`claude-haiku-4.5`) onde o id da API oficial usa hífen e data
     * (`claude-haiku-4-5-20251001`).
     */
    gatewaySlug?: string;
}
/**
 * Catálogo completo de modelos de IA suportados
 *
 * Para adicionar um novo modelo: adicionar entrada aqui e atualizar o provider correspondente no backend.
 * Para deprecar um modelo: setar deprecated: true (mantém retrocompatibilidade).
 *
 * Preços: USD por 1M tokens (março/2026)
 * Context/maxOutput: valores reais da API de cada provider
 */
export declare const AI_MODELS: AIModelDefinition[];
/**
 * Filtra modelos viáveis por custo estimado por atendimento.
 * Cenário fixo: 40K input + 2K output tokens.
 * Exclui modelos deprecated.
 */
export declare function getViableModels(maxCostBRL?: number, usdToBRL?: number): AIModelDefinition[];
/**
 * Resolve o AIProviderType a partir do model ID.
 * Retorna null se modelo não encontrado.
 */
export declare function getProviderFromModel(modelId: string): AIProviderType | null;
/**
 * Busca definição completa do modelo por ID.
 */
export declare function getModelDefinition(modelId: string): AIModelDefinition | undefined;
/**
 * Verifica se um modelo suporta uma feature específica.
 *
 * Retorna `false` se o modelo não for encontrado no catálogo (fail-safe).
 * Útil para checar antes de enviar imagens/PDFs/reasoning para o modelo.
 *
 * @example
 *   modelSupports('gpt-4o-mini', 'image') // true
 *   modelSupports('deepseek-chat', 'image') // false
 */
export declare function modelSupports(modelId: string, feature: AIModelFeature): boolean;
/**
 * Slug deste modelo no Vercel AI Gateway, ou `undefined` quando o modelo
 * não existe lá.
 *
 * `undefined` NÃO é erro: significa "este modelo continua sendo servido pela
 * integração direta do provider de origem". O caller deve tratar isso como
 * fallback silencioso, nunca como falha.
 *
 * @example
 *   getGatewaySlug('gpt-4.1-mini')               // 'openai/gpt-4.1-mini'
 *   getGatewaySlug('claude-haiku-4-5-20251001')  // 'anthropic/claude-haiku-4.5'
 *   getGatewaySlug('deepseek-reasoner')          // undefined — só na API da DeepSeek
 */
export declare function getGatewaySlug(modelId: string): string | undefined;
/**
 * `true` quando o modelo pode ser servido pelo Vercel AI Gateway.
 *
 * Atalho de leitura para decidir se vale tentar o transporte alternativo
 * antes de cair na integração direta do provider.
 */
export declare function isGatewayCapable(modelId: string): boolean;

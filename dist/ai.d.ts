/**
 * Supported AI providers for agent execution
 * These are the providers that support AI_TEXT_GENERATION and AI_CHAT_COMPLETION capabilities
 */
export type AIProviderType = 'openai' | 'anthropic' | 'xai' | 'google' | 'mistral' | 'deepseek';
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

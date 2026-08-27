"use strict";
// ============================================================================
// AI PROVIDER CONFIGURATIONS
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_MODELS = void 0;
exports.getViableModels = getViableModels;
exports.getProviderFromModel = getProviderFromModel;
exports.getModelDefinition = getModelDefinition;
exports.modelSupports = modelSupports;
exports.getGatewaySlug = getGatewaySlug;
exports.isGatewayCapable = isGatewayCapable;
/**
 * Catálogo completo de modelos de IA suportados
 *
 * Para adicionar um novo modelo: adicionar entrada aqui e atualizar o provider correspondente no backend.
 * Para deprecar um modelo: setar deprecated: true (mantém retrocompatibilidade).
 *
 * Preços: USD por 1M tokens (março/2026)
 * Context/maxOutput: valores reais da API de cada provider
 */
exports.AI_MODELS = [
    // ═══════════════════════════════════════════════════════════════
    // OpenAI
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'gpt-4.1-nano',
        gatewaySlug: 'openai/gpt-4.1-nano',
        name: 'GPT-4.1 Nano',
        provider: 'openai',
        features: ['image', 'tools'],
        highlight: 'Ultra rápido e econômico, 1M contexto',
        pricing: { input: 0.10, output: 0.40 },
        contextWindow: 1_000_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'gpt-4o-mini',
        gatewaySlug: 'openai/gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Confiável e versátil',
        pricing: { input: 0.15, output: 0.60 },
        contextWindow: 128_000,
        maxOutputTokens: 16_384,
    },
    {
        id: 'gpt-5-mini',
        gatewaySlug: 'openai/gpt-5-mini',
        name: 'GPT-5 Mini',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'GPT-5 econômico',
        pricing: { input: 0.25, output: 1.00 },
        contextWindow: 128_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'gpt-4.1-mini',
        gatewaySlug: 'openai/gpt-4.1-mini',
        name: 'GPT-4.1 Mini',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Ótimo equilíbrio qualidade/preço, 1M contexto',
        pricing: { input: 0.40, output: 1.60 },
        contextWindow: 1_000_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'o4-mini',
        gatewaySlug: 'openai/o4-mini',
        name: 'o4 Mini',
        provider: 'openai',
        features: ['pdf', 'image', 'tools', 'reasoning'],
        highlight: 'Raciocínio avançado para tarefas complexas',
        pricing: { input: 1.10, output: 4.40 },
        contextWindow: 200_000,
        maxOutputTokens: 100_000,
    },
    {
        id: 'gpt-5',
        gatewaySlug: 'openai/gpt-5',
        name: 'GPT-5',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Máxima inteligência OpenAI',
        pricing: { input: 1.25, output: 10.00 },
        contextWindow: 256_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'gpt-5.4-nano',
        gatewaySlug: 'openai/gpt-5.4-nano',
        name: 'GPT-5.4 Nano',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'GPT-5.4 ultra econômico — classificação e extração',
        pricing: { input: 0.20, output: 1.25 },
        contextWindow: 400_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'gpt-5.4-mini',
        gatewaySlug: 'openai/gpt-5.4-mini',
        name: 'GPT-5.4 Mini',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'GPT-5.4 econômico, ótimo custo/qualidade',
        pricing: { input: 0.75, output: 4.50 },
        contextWindow: 400_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'gpt-5.4',
        gatewaySlug: 'openai/gpt-5.4',
        name: 'GPT-5.4',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Top instruction-following (IFEval 96), 1M contexto',
        pricing: { input: 2.50, output: 15.00 },
        contextWindow: 1_000_000,
        maxOutputTokens: 128_000,
    },
    {
        id: 'gpt-4.1',
        gatewaySlug: 'openai/gpt-4.1',
        name: 'GPT-4.1',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Alta qualidade, contexto gigante',
        pricing: { input: 2.00, output: 8.00 },
        contextWindow: 1_000_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'gpt-4o',
        gatewaySlug: 'openai/gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Multimodal robusto',
        pricing: { input: 2.50, output: 10.00 },
        contextWindow: 128_000,
        maxOutputTokens: 16_384,
    },
    // ═══════════════════════════════════════════════════════════════
    // Anthropic
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'claude-haiku-4-5-20251001',
        gatewaySlug: 'anthropic/claude-haiku-4.5',
        name: 'Claude Haiku 4.5',
        provider: 'anthropic',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Rápido, empático, segue instruções à risca',
        pricing: { input: 1.00, output: 5.00 },
        contextWindow: 200_000,
        maxOutputTokens: 64_000,
    },
    {
        id: 'claude-sonnet-4-5-20250929',
        gatewaySlug: 'anthropic/claude-sonnet-4.5',
        name: 'Claude Sonnet 4.5',
        provider: 'anthropic',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Melhor para agentes complexos',
        pricing: { input: 3.00, output: 15.00 },
        contextWindow: 200_000,
        maxOutputTokens: 64_000,
    },
    {
        id: 'claude-opus-4-5-20251101',
        gatewaySlug: 'anthropic/claude-opus-4.5',
        name: 'Claude Opus 4.5',
        provider: 'anthropic',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Premium — máxima inteligência',
        pricing: { input: 5.00, output: 25.00 },
        contextWindow: 200_000,
        maxOutputTokens: 64_000,
    },
    // ═══════════════════════════════════════════════════════════════
    // Google
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'gemini-2.5-flash-lite',
        gatewaySlug: 'google/gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash Lite',
        provider: 'google',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Ultra econômico com suporte a PDF',
        pricing: { input: 0.10, output: 0.40 },
        contextWindow: 1_000_000,
        maxOutputTokens: 4_096,
    },
    {
        id: 'gemini-2.5-flash',
        gatewaySlug: 'google/gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Melhor custo-benefício, 1M contexto',
        pricing: { input: 0.30, output: 2.50 },
        contextWindow: 1_000_000,
        maxOutputTokens: 8_192,
    },
    {
        id: 'gemini-2.5-pro',
        gatewaySlug: 'google/gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Alta qualidade, 1M contexto',
        pricing: { input: 1.25, output: 10.00 },
        contextWindow: 1_000_000,
        maxOutputTokens: 16_384,
    },
    // ═══════════════════════════════════════════════════════════════
    // DeepSeek
    // IDs validados contra POST /chat/completions em 2026-05-17.
    // A API aceita 4 IDs: 2 explícitos (v4-pro, v4-flash) + 2 aliases
    // (deepseek-chat → V4-Pro, deepseek-reasoner → V4-Pro c/ thinking).
    // GET /models só lista os 2 explícitos, mas POST /chat/completions
    // aceita os 4. NÃO adicionar IDs sem validar via POST.
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'deepseek-v4-pro',
        gatewaySlug: 'deepseek/deepseek-v4-pro',
        name: 'DeepSeek V4-Pro',
        provider: 'deepseek',
        features: ['tools'],
        highlight: 'Top open-weight 2026 — preço promocional até 31/mai/2026',
        // Promo: $0.435 in / $0.87 out até 2026-05-31 15:59 UTC.
        // Após essa data: ajustar para { input: 1.74, output: 3.48 }.
        pricing: { input: 0.435, output: 0.87 },
        contextWindow: 1_000_000,
        maxOutputTokens: 8_192,
    },
    {
        id: 'deepseek-v4-flash',
        gatewaySlug: 'deepseek/deepseek-v4-flash',
        name: 'DeepSeek V4-Flash',
        provider: 'deepseek',
        features: ['tools'],
        highlight: 'Variante leve e barata — fallback se Pro tiver downtime',
        pricing: { input: 0.14, output: 0.28 },
        contextWindow: 1_000_000,
        maxOutputTokens: 8_192,
    },
    {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat (alias V4-Pro)',
        provider: 'deepseek',
        features: ['tools'],
        highlight: 'Alias estável — aponta sempre pro modelo chat mais recente',
        pricing: { input: 0.435, output: 0.87 },
        contextWindow: 1_000_000,
        maxOutputTokens: 8_192,
    },
    {
        id: 'deepseek-reasoner',
        name: 'DeepSeek Reasoner (thinking mode)',
        provider: 'deepseek',
        features: ['tools', 'reasoning'],
        highlight: 'Modo de raciocínio profundo — usa thinking tokens (mais lento + caro)',
        pricing: { input: 0.435, output: 0.87 },
        contextWindow: 1_000_000,
        maxOutputTokens: 8_192,
    },
    // ═══════════════════════════════════════════════════════════════
    // Legados (deprecated — retrocompatibilidade)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        features: ['pdf', 'image', 'tools'],
        highlight: '2M tokens de contexto',
        pricing: { input: 1.25, output: 5.00 },
        contextWindow: 2_097_152,
        maxOutputTokens: 8_192,
        deprecated: true,
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Rápido e eficiente',
        pricing: { input: 0.075, output: 0.30 },
        contextWindow: 1_000_000,
        maxOutputTokens: 8_192,
        deprecated: true,
    },
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        features: ['tools'],
        highlight: 'Legado',
        pricing: { input: 0.50, output: 1.50 },
        contextWindow: 32_768,
        maxOutputTokens: 4_096,
        deprecated: true,
    },
    {
        id: 'gpt-5.1',
        name: 'GPT-5.1',
        provider: 'openai',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Legado',
        pricing: { input: 2.00, output: 8.00 },
        contextWindow: 256_000,
        maxOutputTokens: 32_768,
        deprecated: true,
    },
    // gpt-5-turbo removido em 2026-05-17 — não existe na API OpenAI (era ID inventado/obsoleto).
    {
        id: 'claude-sonnet-4-20250514',
        gatewaySlug: 'anthropic/claude-sonnet-4',
        name: 'Claude Sonnet 4',
        provider: 'anthropic',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Legado',
        pricing: { input: 3.00, output: 15.00 },
        contextWindow: 200_000,
        maxOutputTokens: 64_000,
        deprecated: true,
    },
    {
        id: 'claude-opus-4-20250514',
        gatewaySlug: 'anthropic/claude-opus-4',
        name: 'Claude Opus 4',
        provider: 'anthropic',
        features: ['pdf', 'image', 'tools'],
        highlight: 'Legado',
        pricing: { input: 15.00, output: 75.00 },
        contextWindow: 200_000,
        maxOutputTokens: 64_000,
        deprecated: true,
    },
    // claude-3-5-sonnet-latest e claude-3-5-haiku-latest removidos em 2026-05-17
    // — IDs com sufixo `-latest` não são aceitos pela API atual da Anthropic.
    // ─── Verificação de conformidade ─────────────────────────────────────────
    // Peso aberto da OpenAI, treinado para ler uma política escrita em texto
    // livre e dar veredito — que é exatamente o formato do MessageGuard.
    //
    // Medido em 25/08/2026 sobre 80 atendimentos reais: 11 apontamentos com 36%
    // de alarme falso, contra 74% do gpt-4.1-mini e 97% do gemini-2.5-flash-lite
    // nos MESMOS dados — sendo o mais barato dos três. Fora da conta uma regra
    // mal escrita, fez 1 apontamento em 80 turnos: é um juiz quieto, que é o que
    // se quer num portão que bloqueia.
    //
    // `purpose: 'judge'` o mantém fora do seletor de agente: ele não atende
    // cliente. E SÓ existe pelo gateway — a API da OpenAI não serve peso aberto.
    {
        id: 'gpt-oss-safeguard-20b',
        gatewaySlug: 'openai/gpt-oss-safeguard-20b',
        name: 'GPT-OSS Safeguard 20B',
        provider: 'openai',
        purpose: 'judge',
        features: ['tools', 'reasoning'],
        highlight: 'Verificação de conformidade — o mais preciso e o mais barato (só via gateway)',
        pricing: { input: 0.07, output: 0.20 },
        contextWindow: 128_000,
        maxOutputTokens: 32_768,
    },
    {
        id: 'gpt-oss-safeguard-120b',
        gatewaySlug: 'openai/gpt-oss-safeguard-120b',
        name: 'GPT-OSS Safeguard 120B',
        provider: 'openai',
        purpose: 'judge',
        features: ['tools', 'reasoning'],
        highlight: 'Irmão maior do Safeguard 20B — mais caro, ainda não medido aqui',
        pricing: { input: 0.15, output: 0.60 },
        contextWindow: 128_000,
        maxOutputTokens: 32_768,
    },
];
// ============================================================================
// AI MODEL HELPERS
// ============================================================================
/**
 * Filtra modelos viáveis por custo estimado por atendimento.
 * Cenário fixo: 40K input + 2K output tokens.
 * Exclui modelos deprecated.
 */
function getViableModels(maxCostBRL = 0.40, usdToBRL = 5.80) {
    const INPUT_TOKENS = 40_000;
    const OUTPUT_TOKENS = 2_000;
    return exports.AI_MODELS.filter(model => {
        if (model.deprecated)
            return false;
        // Modelo de julgamento não conversa com cliente — fora do seletor do agente.
        if (model.purpose === 'judge')
            return false;
        const cost = (INPUT_TOKENS / 1_000_000 * model.pricing.input
            + OUTPUT_TOKENS / 1_000_000 * model.pricing.output) * usdToBRL;
        return cost <= maxCostBRL;
    });
}
/**
 * Resolve o AIProviderType a partir do model ID.
 * Retorna null se modelo não encontrado.
 */
function getProviderFromModel(modelId) {
    const model = exports.AI_MODELS.find(m => m.id === modelId);
    return model?.provider ?? null;
}
/**
 * Busca definição completa do modelo por ID.
 */
function getModelDefinition(modelId) {
    return exports.AI_MODELS.find(m => m.id === modelId);
}
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
function modelSupports(modelId, feature) {
    const def = getModelDefinition(modelId);
    return def?.features.includes(feature) ?? false;
}
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
function getGatewaySlug(modelId) {
    return getModelDefinition(modelId)?.gatewaySlug;
}
/**
 * `true` quando o modelo pode ser servido pelo Vercel AI Gateway.
 *
 * Atalho de leitura para decidir se vale tentar o transporte alternativo
 * antes de cair na integração direta do provider.
 */
function isGatewayCapable(modelId) {
    return getGatewaySlug(modelId) !== undefined;
}

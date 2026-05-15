/**
 * Catálogo das tags XML usadas em system prompts de agentes — single
 * source of truth pra frontend + backend.
 *
 * Estes nomes refletem o catálogo do `PromptRewriterService` (Coach
 * Apply Diff) que reescreve prompts de agentes em XML estruturado.
 * Backend usa pra:
 *   - Pós-filtro do `analyze-prompt` (NUNCA migrar conteúdo dentro
 *     dessas tags pra knowledge base)
 *   - Validação do output do rewriter
 *
 * Frontend usa pra:
 *   - Highlighting do editor Monaco
 *   - Documentação inline (helper text "Estruture em <persona>, <style>...")
 *   - Validação de prompts customizados
 *
 * **Distinção essencial (RAG industry best practice 2026)**:
 *   - Tags abaixo = COMPORTAMENTO do agente, ficam SEMPRE no prompt
 *   - Knowledge Base = conteúdo factual de domínio (preços, FAQ, dados
 *     técnicos públicos) que é consultado sob demanda via RAG
 *   - Regras de negócio, identidade, fluxo, escalation, autocrítica
 *     são COMPORTAMENTO — NUNCA viram documento de KB
 *
 * Referências:
 *   - Regal AI - The RAG Playbook
 *   - StackAI - Prompt Engineering for RAG Pipelines
 *   - AIAMastery - System Prompts That Prevent Hallucination
 */

/**
 * As 14 tags canônicas do catálogo XML usado pelo `PromptRewriterService`.
 * Ordem reflete a sequência típica em prompts bem estruturados.
 */
export const AGENT_PROMPT_CANONICAL_TAGS = [
  'persona',
  'style',
  'communication_rules',
  'self_review',
  'audit',
  'flow',
  'tools_rules',
  'knowledge_usage',
  'scope',
  'guardrails',
  'uncertainty_handling',
  'escalation',
  'objection_handling',
  'special_cases',
] as const;

export type AgentPromptCanonicalTag = (typeof AGENT_PROMPT_CANONICAL_TAGS)[number];

/**
 * Tags reservadas pelo runtime (`SystemPromptComposer`) — geradas
 * automaticamente em cada chamada do agente. NÃO devem ser escritas
 * pelo admin no systemPrompt nem pelo `PromptRewriterService`.
 */
export const AGENT_PROMPT_RESERVED_TAGS = [
  'role',
  'platform_rules',
  'anti_fabrication',
  'tool_usage',
  'knowledge_bases',
  'capabilities',
  'examples',
  'messaging_window_closed',
  'temporal_context',
  'contact_history',
  'contact',
  'lead',
  'additional_instruction',
] as const;

export type AgentPromptReservedTag = (typeof AGENT_PROMPT_RESERVED_TAGS)[number];

/**
 * União de TODAS as tags que indicam **comportamento do agente**, e
 * portanto NUNCA podem ter conteúdo migrado pra knowledge base.
 *
 * Inclui:
 *   - 14 canônicas (catálogo XML do PromptRewriter)
 *   - 13 reservadas (injetadas pelo SystemPromptComposer em runtime)
 *   - Sinônimos comuns que admins escrevem ("rules", "never_do", etc.)
 *   - Headers markdown que descrevem comportamento ("identidade",
 *     "comportamento", "regras", "fluxo", "diretrizes", etc.) —
 *     prompts legacy usam markdown em vez de XML
 */
export const AGENT_PROMPT_BEHAVIOR_TAGS = [
  // 14 canônicas do catálogo XML
  ...AGENT_PROMPT_CANONICAL_TAGS,
  // 13 reservadas do composer runtime
  ...AGENT_PROMPT_RESERVED_TAGS,
  // Sinônimos comuns escritos por admins (sem padronização)
  'identidade',
  'identity',
  'tone',
  'rules',
  'regras',
  'never_do',
  'forbidden',
  'comportamento',
  'behavior',
  'objetivo',
  'goal',
  'fluxo',
  'workflow',
  'diretrizes',
  'guidelines',
] as const;

/**
 * Headers markdown (h1/h2/h3) que indicam que o conteúdo subsequente é
 * COMPORTAMENTO do agente, não KB. Usado pelo pós-filtro do `analyze-prompt`
 * pra detectar prompts legacy escritos em markdown em vez de tags XML.
 *
 * Match case-insensitive, normalizado (sem acentos comparados em lowercase).
 * Cobertura: títulos em PT-BR + EN-US comuns.
 */
export const AGENT_PROMPT_BEHAVIOR_MARKDOWN_HEADERS: readonly string[] = [
  'identidade',
  'identity',
  'persona',
  'sobre voce',
  'sobre você',
  'about you',
  'role',
  'papel',
  'apresentacao',
  'apresentação',
  'comportamento',
  'comportamento e tom',
  'behavior',
  'behavior and tone',
  'tom',
  'tone',
  'estilo',
  'style',
  'objetivo',
  'objetivo principal',
  'goal',
  'mission',
  'missao',
  'missão',
  'regras',
  'regra',
  'rules',
  'rule',
  'regras importantes',
  'regras criticas',
  'regras críticas',
  'critical rules',
  'fluxo',
  'fluxo de atendimento',
  'fluxo da conversa',
  'workflow',
  'flow',
  'diretrizes',
  'diretrizes de comunicacao',
  'diretrizes de comunicação',
  'guidelines',
  'communication guidelines',
  'rapport',
  'rapport geografico',
  'rapport geográfico',
  'escopo',
  'scope',
  'limites',
  'limits',
  'escalation',
  'escalonamento',
  'transferencia',
  'transferência',
  'handoff',
  'protocolo',
  'protocol',
  'autocritica',
  'autocrítica',
  'self review',
  'self-review',
  'guardrails',
  'protecao',
  'proteção',
  'safety',
  'casos especiais',
  'special cases',
  'casos retornando',
  'lead retornando',
  'objecoes',
  'objeções',
  'objection handling',
  'manejo de objecoes',
  'manejo de objeções',
  'nunca faca',
  'nunca faça',
  'never do',
  'forbidden',
  'proibido',
  // Sub-protocolos comuns
  'protocolo de continuidade',
  'continuity protocol',
  'regra de conducao',
  'regra de condução',
  'continuity rule',
];

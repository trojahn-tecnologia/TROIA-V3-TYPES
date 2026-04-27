/**
 * AssignmentContext — Contexto canônico de qualquer atribuição/transferência
 * de lead, conversation ou ticket.
 *
 * Atravessa os 5 caminhos de origem possíveis:
 * 1. Manual via endpoint POST /:id/transfer
 * 2. Distribuição automática via DistributionService (autoAssignFrom*)
 * 3. Routing rules (leads-routing-rules)
 * 4. AI tool (Mastra transfer_to_human / transfer_to_team)
 * 5. Workflow (AssignStepFactory)
 *
 * Persistido em:
 * - `Activity.metadata` (Lead, via módulo activities polimórfico)
 * - `SystemContent.details` em ConversationMessage (Conversation, com action='assignment_changed')
 * - Campo `metadata` da entry em ticket-activities (Ticket)
 *
 * O texto humano em pt-BR é montado no read pelo backend (mapToResponse) a
 * partir deste contexto + nomes resolvidos via Two-Phase Fetch.
 */

/** Origem temporal/categoria da atribuição. */
export type AssignmentSource =
  | 'manual'   // Usuário acionou o /transfer ou assign na UI
  | 'auto'     // Sistema atribuiu automaticamente (depois da criação)
  | 'creation'; // Atribuição automática no momento da criação da entidade

/**
 * Estratégia/lógica que decidiu o destinatário.
 *
 * Os valores `sequential` … `last_interaction` são exatamente os
 * `DistributionStrategy` aplicados quando `source === 'auto'` ou `'creation'`.
 *
 * Os valores `manual`, `routing_rule`, `ai_tool` e `workflow` representam
 * caminhos que não passam pelo DistributionService diretamente (ou que
 * passam mas trazem contexto adicional, como uma regra ou um agente IA).
 */
export type AssignmentStrategy =
  | 'manual'
  | 'sequential'
  | 'fixed_operator'
  | 'fixed_team'
  | 'shift'
  | 'availability'
  | 'last_interaction'
  | 'routing_rule'
  | 'ai_tool'
  | 'workflow';

/**
 * Contexto canônico passado pros services de domínio (`LeadsService`,
 * `ConversationsService`, `TicketsService`) ao executar uma atribuição.
 *
 * É também a forma persistida em metadata — todos os campos de ID ficam
 * normalizados (string), os nomes correspondentes são resolvidos via
 * Two-Phase Fetch no read.
 */
export interface AssignmentContext {
  source: AssignmentSource;
  strategy: AssignmentStrategy;

  /** User que disparou (quando humano). null/undefined em automações puras. */
  actorId?: string;

  /** Justificativa textual livre informada pelo operador (se houver). */
  reason?: string;

  /** Estado anterior. */
  fromUserId?: string | null;
  fromTeamId?: string | null;

  /** Estado novo. `null` significa unassign explícito. */
  toUserId?: string | null;
  toTeamId?: string | null;

  // ── Campos específicos por origem ─────────────────────────────────────

  /** Quando `strategy === 'routing_rule'`. */
  routingRuleId?: string;

  /** Quando `strategy === 'ai_tool'`. */
  aiAgentId?: string;
  aiToolName?: string;

  /** Quando `strategy === 'workflow'`. */
  workflowId?: string;

  /** Quando `strategy === 'last_interaction'` — pra texto "anterior: Pedro". */
  previousUserId?: string;
}

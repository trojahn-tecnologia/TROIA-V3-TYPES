"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });

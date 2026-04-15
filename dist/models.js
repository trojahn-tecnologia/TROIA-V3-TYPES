"use strict";
/**
 * MODELS - MongoDB Document Types
 *
 * Define a forma exata dos documentos armazenados no MongoDB.
 * Usa o utility type ToModel para converter tipos de API (string IDs, string dates)
 * para tipos de documento (ObjectId, Date).
 *
 * Uso nos repositories:
 *   class TicketsRepository extends GenericRepository<TicketModel, TicketResponse, ...>
 *
 * O preprocessCreate do repository DEVE converter os campos listados aqui
 * para garantir consistência entre storage e queries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL_OBJECTID_FIELDS = void 0;
// NOTA: AssignmentModel foi removido — a collection `assignments` foi
// dropada na Fase 1b (Distribution & Context-Users Refactor). Distribuição
// e rotação agora moram diretamente em channels/funnels/pipelines via
// `assignmentConfig: DistributionConfig` + `lastAssignedUserId: number`.
// ============================================================================
// HELPER: ID Fields per Model (for preprocessCreate reference)
// ============================================================================
/**
 * Lista os campos ObjectId de cada model.
 * Use como referência ao implementar preprocessCreate nos repositories.
 *
 * @example
 * // No repository:
 * protected preprocessCreate(data: CreateTicketRequest) {
 *   return {
 *     ...data,
 *     // Converter todos os campos listados em TICKET_OBJECTID_FIELDS
 *     pipelineId: data.pipelineId ? new ObjectId(data.pipelineId) : undefined,
 *     stageId: data.stageId ? new ObjectId(data.stageId) : undefined,
 *     // ...
 *   };
 * }
 */
exports.MODEL_OBJECTID_FIELDS = {
    ticket: ['appId', 'companyId', 'pipelineId', 'stageId', 'customerId', 'contactId', 'leadId', 'assigneeId', 'teamId', 'assignedBy', 'conversationId', 'channelId'],
    ticketPipeline: ['appId', 'companyId'],
    ticketStage: ['appId', 'companyId', 'pipelineId'],
    conversation: ['appId', 'companyId', 'channelId', 'customerId', 'contactId', 'leadId', 'ticketId', 'assigneeId', 'teamId', 'assignedBy'],
    conversationMessage: ['appId', 'companyId', 'conversationId', 'fromUserId', 'toUserId'],
    lead: ['appId', 'companyId', 'contactId', 'channelId', 'funnelId', 'stepId', 'assigneeId', 'teamId', 'assignedBy', 'customerId'],
    contact: ['appId', 'companyId', 'customerId', 'assigneeId', 'teamId'],
    customer: ['appId', 'companyId', 'assigneeId', 'teamId'],
    user: ['appId', 'companyId', 'levelId'],
    channel: ['appId', 'companyId'],
    shift: ['appId', 'companyId', 'userId', 'teamId'],
    savedCard: ['appId', 'companyId', 'userId'],
};

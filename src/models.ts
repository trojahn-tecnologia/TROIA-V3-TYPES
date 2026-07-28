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

import { ObjectId } from 'mongodb';

// Entity types (API/Response shape - uses string for IDs and dates)
import type { Ticket } from './tickets';
import type {
  TicketPipeline,
  TicketStage
} from './ticket-pipelines';
import type { Conversation } from './conversations';
import type { ConversationMessage } from './conversation-messages';
import type { Lead } from './leads';
import type { Funnel } from './funnels';
import type { Contact } from './contacts';
import type { Customer } from './customers';
import type { Activity } from './activities';
import type { App } from './app';
import type { Channel } from './channels';
import type { Company } from './companies';
import type { User } from './user';
import type { Team, TeamUser, TeamResource } from './teams';
import type { Shift } from './shifts';
import type { Level } from './levels';
import type { Plan } from './plans';
import type { EmailTemplateResponse } from './email-templates';
import type { AppIntegrationResponse } from './app-integrations';
import type { CompanyIntegrationResponse } from './company-integrations';
import type { SavedCard } from './saved-cards';
import type { CalendarEvent } from './calendar';
import type { ExternalApiKeyResponse } from './api-keys';

// ============================================================================
// UTILITY TYPE: ToModel
// ============================================================================

/**
 * Converte um tipo de API/Response para um tipo de MongoDB Document.
 *
 * - Remove 'id: string' e adiciona '_id?: ObjectId'
 * - Converte campos string especificados para ObjectId
 * - Converte campos string especificados para Date
 * - Adiciona 'deletedAt?: Date' para soft delete
 *
 * @template T - Tipo da entidade (API shape)
 * @template ObjIdFields - Campos que devem ser ObjectId no MongoDB
 * @template DateFields - Campos que devem ser Date no MongoDB
 *
 * @example
 * type TicketModel = ToModel<
 *   Ticket,
 *   'appId' | 'companyId' | 'pipelineId',  // string → ObjectId
 *   'createdAt' | 'updatedAt'               // string → Date
 * >;
 */
export type ToModel<
  T,
  ObjIdFields extends keyof T = never,
  DateFields extends keyof T = never
> =
  Omit<T, 'id' | ObjIdFields | DateFields> &
  { _id?: ObjectId; deletedAt?: Date } &
  {
    [K in ObjIdFields]: T[K] extends string
      ? ObjectId
      : T[K] extends string | undefined
        ? ObjectId | undefined
        : T[K]
  } &
  {
    [K in DateFields]: T[K] extends string
      ? Date
      : T[K] extends string | undefined
        ? Date | undefined
        : T[K]
  };

/**
 * ToModelFromResponse - Para tipos Response que já removem _id e adicionam id: string.
 * Usado para entidades que estendem AppAwareDocument/TenantAwareDocument
 * onde appId/companyId já são ObjectId mas o Response converte para string.
 */
export type ToModelFromResponse<
  TResponse,
  ObjIdFields extends keyof TResponse = never,
  DateFields extends keyof TResponse = never
> = ToModel<TResponse, ObjIdFields, DateFields>;

// ============================================================================
// CORE MODELS
// ============================================================================

/** App - Documento da aplicação (sem companyId) */
export type AppModel = ToModel<
  App,
  never,
  'createdAt' | 'updatedAt'
>;

/** Company - Documento da empresa */
export type CompanyModel = ToModel<
  Company,
  'appId',
  'createdAt' | 'updatedAt'
>;

/** User - Documento do usuário */
export type UserModel = ToModel<
  User,
  'appId' | 'companyId' | 'levelId',
  'createdAt' | 'updatedAt' | 'lastLoginAt'
>;

// ============================================================================
// TEAM & RESOURCE MODELS
// ============================================================================

/** Team - Equipe */
export type TeamModel = ToModel<
  Team,
  'appId' | 'companyId',
  'createdAt' | 'updatedAt'
>;

/** TeamUser - Membro de equipe */
export type TeamUserModel = ToModel<
  TeamUser,
  'appId' | 'companyId' | 'teamId' | 'userId',
  'joinedAt'
>;

/** TeamResource - Recurso de equipe */
export type TeamResourceModel = ToModel<
  TeamResource,
  'appId' | 'companyId' | 'teamId' | 'resourceId' | 'assignedBy',
  'assignedAt'
>;

// ============================================================================
// CONFIGURATION MODELS
// ============================================================================

/** Channel - Canal de comunicação */
export type ChannelModel = ToModel<
  Channel,
  'appId' | 'companyId',
  'createdAt' | 'updatedAt'
>;

/**
 * ShiftModel - Turno de trabalho
 *
 * Shift extends base types que já usam ObjectId/Date para appId, companyId, teamId, createdAt, updatedAt.
 * Não precisa de ToModel pois todos os campos já estão no formato correto.
 */
export type ShiftModel = Shift & { deletedAt?: Date };

/** Level - Nível hierárquico */
export type LevelModel = ToModel<
  Level,
  'appId' | 'companyId',
  'createdAt' | 'updatedAt'
>;

/** Plan - Plano */
export type PlanModel = ToModel<
  Plan,
  'appId',
  'createdAt' | 'updatedAt'
>;

// ============================================================================
// CUSTOMER SERVICE MODELS
// ============================================================================

/** Contact - Contato */
export type ContactModel = ToModel<
  Contact,
  'appId' | 'companyId' | 'customerId' | 'assigneeId' | 'teamId',
  'createdAt' | 'updatedAt'
>;

/** Customer - Cliente */
export type CustomerModel = ToModel<
  Customer,
  'appId' | 'companyId' | 'assigneeId' | 'teamId',
  'createdAt' | 'updatedAt'
>;

/** Lead - Oportunidade */
export type LeadModel = ToModel<
  Lead,
  'appId' | 'companyId' | 'contactId' | 'channelId' | 'funnelId' | 'stepId' | 'assigneeId' | 'teamId' | 'assignedBy' | 'customerId',
  'createdAt' | 'updatedAt' | 'assignedAt' | 'lostDate' | 'lastInteractionAt' | 'lastFollowUpAt' | 'lastStepAt' | 'lastActivityAt' | 'wonDate'
>;

/**
 * FunnelModel - Funil de vendas
 *
 * Funnel extends AppAwareDocument (já tem appId: ObjectId, _id, createdAt: Date).
 * GenericRepository.create() injeta companyId.
 */
export type FunnelModel = Funnel & {
  companyId: ObjectId;
  deletedAt?: Date;
};

// ============================================================================
// TICKET MODELS
// ============================================================================

/** Ticket - Ticket de atendimento */
export type TicketModel = ToModel<
  Ticket,
  'appId' | 'companyId' | 'pipelineId' | 'stageId' | 'customerId' | 'contactId' | 'leadId' | 'assigneeId' | 'teamId' | 'assignedBy' | 'conversationId' | 'channelId',
  'createdAt' | 'updatedAt' | 'assignedAt' | 'firstResponseAt' | 'lastResponseAt' | 'resolvedAt' | 'closedAt' | 'dueDate'
>;

/**
 * TicketPipelineModel - Pipeline de tickets
 *
 * TicketPipeline extends AppAwareDocument (já tem appId: ObjectId, _id, createdAt: Date)
 * Mas GenericRepository.create() também injeta companyId.
 */
export type TicketPipelineModel = TicketPipeline & {
  companyId: ObjectId;
  deletedAt?: Date;
};

/**
 * TicketStageModel - Etapa de pipeline
 *
 * TicketStage extends AppAwareDocument (já tem appId: ObjectId, _id, createdAt: Date)
 * pipelineId declarado como string na interface, mas deve ser ObjectId no MongoDB.
 */
export type TicketStageModel = Omit<TicketStage, 'pipelineId'> & {
  companyId: ObjectId;
  pipelineId: ObjectId;
  deletedAt?: Date;
};

// ============================================================================
// COMMUNICATION MODELS
// ============================================================================

/** Conversation - Conversa */
export type ConversationModel = ToModel<
  Conversation,
  'appId' | 'companyId' | 'channelId' | 'customerId' | 'contactId' | 'leadId' | 'ticketId' | 'assigneeId' | 'teamId' | 'assignedBy',
  'createdAt' | 'updatedAt' | 'assignedAt' | 'lastMessageAt' | 'lastMessageFromCustomer' | 'startedAt' | 'endedAt'
>;

/**
 * ConversationMessageModel - Mensagem de conversa
 *
 * Nota: replyToMessageId e forwardedFromMessageId permanecem como string
 * (são IDs externos, não ObjectId MongoDB).
 */
export type ConversationMessageModel = ToModel<
  ConversationMessage,
  'appId' | 'companyId' | 'conversationId',
  'sentAt' | 'deliveredAt' | 'readAt' | 'createdAt' | 'updatedAt'
>;

/** Activity - Registro de atividade */
export type ActivityModel = ToModel<
  Activity,
  'appId' | 'companyId' | 'entityId' | 'actorId',
  'occurredAt' | 'createdAt' | 'updatedAt'
>;

// ============================================================================
// INTEGRATION MODELS
// ============================================================================

/** AppIntegration - Integração a nível de app */
export type AppIntegrationModel = ToModel<
  AppIntegrationResponse,
  'appId',
  'createdAt' | 'updatedAt'
>;

/** CompanyIntegration - Integração a nível de empresa */
export type CompanyIntegrationModel = ToModel<
  CompanyIntegrationResponse,
  'appId' | 'companyId',
  'createdAt' | 'updatedAt' | 'lastSyncAt'
>;

/** ExternalApiKey - Chave de API */
export type ExternalApiKeyModel = ToModel<
  ExternalApiKeyResponse,
  'appId' | 'companyId',
  'createdAt' | 'updatedAt' | 'lastUsedAt' | 'expiresAt'
>;

// ============================================================================
// OTHER MODELS
// ============================================================================

/** EmailTemplate - Template de email */
export type EmailTemplateModel = ToModel<
  EmailTemplateResponse,
  'appId' | 'companyId',
  'createdAt' | 'updatedAt'
>;

/** SavedCard - Cartão salvo */
export type SavedCardModel = ToModel<
  SavedCard,
  'appId' | 'companyId' | 'userId',
  'createdAt' | 'updatedAt' | 'lastUsedAt'
>;

/** CalendarEvent - Evento de calendário */
export type CalendarEventModel = ToModel<
  CalendarEvent,
  'appId' | 'companyId',
  'createdAt' | 'updatedAt'
>;

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
export const MODEL_OBJECTID_FIELDS = {
  ticket: ['appId', 'companyId', 'pipelineId', 'stageId', 'customerId', 'contactId', 'leadId', 'assigneeId', 'teamId', 'assignedBy', 'conversationId', 'channelId'] as const,
  ticketPipeline: ['appId', 'companyId'] as const,
  ticketStage: ['appId', 'companyId', 'pipelineId'] as const,
  conversation: ['appId', 'companyId', 'channelId', 'customerId', 'contactId', 'leadId', 'ticketId', 'assigneeId', 'teamId', 'assignedBy'] as const,
  conversationMessage: ['appId', 'companyId', 'conversationId', 'fromUserId', 'toUserId'] as const,
  lead: ['appId', 'companyId', 'contactId', 'channelId', 'funnelId', 'stepId', 'assigneeId', 'teamId', 'assignedBy', 'customerId'] as const,
  contact: ['appId', 'companyId', 'customerId', 'assigneeId', 'teamId'] as const,
  customer: ['appId', 'companyId', 'assigneeId', 'teamId'] as const,
  user: ['appId', 'companyId', 'levelId'] as const,
  channel: ['appId', 'companyId'] as const,
  shift: ['appId', 'companyId', 'userId', 'teamId'] as const,
  savedCard: ['appId', 'companyId', 'userId'] as const,
} as const;

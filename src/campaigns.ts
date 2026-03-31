import { TenantAwareDocument, PaginationQuery, ListResponse } from './common';

/**
 * Campaign - Campanha de marketing multi-canal
 */
export interface Campaign extends TenantAwareDocument {
  name: string;
  description: string;
  channelId: string;               // Channel de comunicação
  templateId: string;              // Template vinculado
  audienceType: AudienceType;      // leads, customers, groups, manual
  audienceFilter?: AudienceFilter; // Filtros de seleção
  recipientIds?: string[];         // IDs manuais (se audienceType = manual)
  variableMapping: VariableMapping; // Mapeia variáveis do template
  schedulingType: SchedulingType;  // immediate, scheduled, recurring
  scheduledFor?: string;           // Data/hora agendada (ISO string)
  recurringConfig?: RecurringConfig; // Config de recorrência
  status: CampaignStatus;
  stats: CampaignStats;
}

/**
 * Campaign Status
 */
export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Audience Type - Tipo de audiência da campanha
 */
export enum AudienceType {
  LEADS = 'leads',           // Leads collection (via contactId)
  CONTACTS = 'contacts'      // Contacts collection
}

/**
 * Audience Filter - Filtros para seleção de audiência
 */
export interface AudienceFilter {
  // Shared
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  // Leads-specific
  priority?: string[];
  businessStatus?: string[];
  temperature?: string[];
  qualifyStatus?: string[];
  source?: string[];
  medium?: string[];
  channel?: string[];
  origin?: string[];
  type?: string[];
  segment?: string[];
  campaignName?: string[];
  adsetName?: string[];
  adName?: string[];
  // Contacts-specific
  channelType?: string[];
}

/**
 * Variable Mapping - Mapeamento de variáveis do template
 */
export interface VariableMapping {
  [position: number]: FieldMapping;
}

/**
 * Field Mapping - Mapeamento de um campo específico
 */
export interface FieldMapping {
  source: 'field' | 'static';
  fieldName?: string;        // Ex: "name", "email", "phone"
  staticValue?: string;      // Valor fixo
}

/**
 * Scheduling Type - Tipo de agendamento
 */
export enum SchedulingType {
  IMMEDIATE = 'immediate',   // Enviar imediatamente
  SCHEDULED = 'scheduled',   // Enviar em data/hora específica
  RECURRING = 'recurring'    // Enviar periodicamente
}

/**
 * Recurring Config - Configuração de recorrência
 */
export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;        // 0-6 (se weekly)
  dayOfMonth?: number;       // 1-31 (se monthly)
  hour: number;              // 0-23
  minute: number;            // 0-59
  timezone: string;          // Ex: "America/Sao_Paulo"
  endDate?: string;          // Data final de recorrência (ISO string)
}

/**
 * Campaign Stats - Estatísticas da campanha
 */
export interface CampaignStats {
  totalRecipients: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  messagesRead: number;
  startedAt?: string;      // ISO string
  completedAt?: string;    // ISO string
}

/**
 * Campaign Response - Response type sem _id
 */
export interface CampaignResponse extends Omit<Campaign, '_id'> {
  id: string;
}

/**
 * Campaign List Response
 */
export interface CampaignListResponse extends ListResponse<CampaignResponse> {}

/**
 * Create Campaign Request
 */
export interface CreateCampaignRequest {
  name: string;
  description: string;
  channelId: string;
  templateId: string;
  audienceType: AudienceType;
  audienceFilter?: AudienceFilter;
  recipientIds?: string[];
  variableMapping: VariableMapping;
  schedulingType: SchedulingType;
  scheduledFor?: string | null;    // ISO string, null for immediate
  recurringConfig?: RecurringConfig;
}

/**
 * Update Campaign Request
 */
export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  channelId?: string;
  templateId?: string;
  audienceType?: AudienceType;
  audienceFilter?: AudienceFilter;
  recipientIds?: string[];
  variableMapping?: VariableMapping;
  schedulingType?: SchedulingType;
  scheduledFor?: string | null;    // ISO string, null for immediate
  recurringConfig?: RecurringConfig;
  status?: CampaignStatus;
}

/**
 * Campaign Query
 */
export interface CampaignQuery extends PaginationQuery {
  status?: CampaignStatus | CampaignStatus[];
  templateId?: string;
  audienceType?: AudienceType;
  schedulingType?: SchedulingType;
  search?: string;
}

/**
 * Campaign Stats Response
 */
export interface CampaignStatsResponse {
  totalRecipients: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  messagesRead: number;
  deliveryRate: number;       // (messagesDelivered / messagesSent) * 100
  readRate: number;           // (messagesRead / messagesDelivered) * 100
  failureRate: number;        // (messagesFailed / messagesSent) * 100
  startedAt?: string;
  completedAt?: string;
  duration?: number;          // ms
}

/**
 * Test Campaign Request
 */
export interface TestCampaignRequest {
  testRecipients: string[];   // Array de IDs para teste
  variableMapping: VariableMapping;
}

// ============================================================
// CAMPAIGN MESSAGES - Tracking de mensagens individuais
// ============================================================

/**
 * Campaign Message Status - Status de cada mensagem individual
 */
export enum CampaignMessageStatus {
  PENDING = 'pending',        // Aguardando envio
  QUEUED = 'queued',          // Na fila do BullMQ
  SENDING = 'sending',        // Em processo de envio
  SENT = 'sent',              // Enviado ao provider
  DELIVERED = 'delivered',    // Entregue ao destinatário
  READ = 'read',              // Lido pelo destinatário
  FAILED = 'failed',          // Falhou no envio
  CANCELLED = 'cancelled'     // Cancelado (campanha pausada/cancelada)
}

/**
 * Campaign Message - Documento de tracking por destinatário
 */
export interface CampaignMessage extends TenantAwareDocument {
  campaignId: string;               // Referência à campanha
  recipientId: string;              // ID do lead/contato ou número manual
  recipientIdentifier: string;      // Identificador do destinatário (phone, email, etc.)
  recipientName?: string;           // Nome para variáveis
  recipientData?: Record<string, unknown>; // Dados extras para variáveis
  status: CampaignMessageStatus;
  providerMessageId?: string;       // ID retornado pelo WhatsApp/Gateway
  sentAt?: string;                  // ISO string
  deliveredAt?: string;             // ISO string
  readAt?: string;                  // ISO string
  failedAt?: string;                // ISO string
  failureReason?: string;
  retryCount: number;
}

/**
 * Campaign Message Response - Response type sem _id
 */
export interface CampaignMessageResponse extends Omit<CampaignMessage, '_id'> {
  id: string;
}

/**
 * Campaign Message List Response
 */
export interface CampaignMessageListResponse extends ListResponse<CampaignMessageResponse> {}

/**
 * Campaign Message Query
 */
export interface CampaignMessageQuery extends PaginationQuery {
  campaignId?: string;
  status?: CampaignMessageStatus | CampaignMessageStatus[];
  recipientIdentifier?: string;
  search?: string;
}

/**
 * Campaign Message Job Data - Dados do job na queue BullMQ
 */
export interface CampaignMessageJobData {
  campaignMessageId: string;  // ID do documento campaign-messages
  campaignId: string;
  channelId: string;
  templateId: string;
  recipientIdentifier: string;
  recipientName?: string;
  variables: Record<string, string>;  // Variáveis já resolvidas
  appId: string;
  companyId: string;
}

/**
 * Campaign Message Stats By Status - Agregação por status
 */
export interface CampaignMessageStatsByStatus {
  status: CampaignMessageStatus;
  count: number;
}

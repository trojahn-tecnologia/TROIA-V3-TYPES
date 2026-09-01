import { TenantAwareDocument, PaginationQuery, ListResponse } from './common';
/**
 * Campaign - Campanha de marketing multi-canal
 */
export interface Campaign extends TenantAwareDocument {
    name: string;
    description: string;
    channelId: string;
    templateId: string;
    audienceType: AudienceType;
    audienceFilter?: AudienceFilter;
    recipientIds?: string[];
    audienceId?: string;
    variableMapping: VariableMapping;
    schedulingType: SchedulingType;
    scheduledFor?: string;
    recurringConfig?: RecurringConfig;
    status: CampaignStatus;
    stats: CampaignStats;
    /** Preenchido quando a campanha se pausa sozinha; limpo ao retomar. */
    autoPause?: CampaignAutoPauseInfo;
}
/**
 * Pausa automática (2026-08-27): uma campanha em andamento vira `paused`
 * sozinha quando o canal que ela usa não está utilizável — desconectado, ou
 * excluído no meio do disparo.
 *
 * Existe porque em 26–27/08/2026 duas campanhas queimaram 105 tentativas de
 * envio contra canais fora do ar (um nunca conectou, o outro foi excluído
 * depois do início) e ficaram travadas em "em andamento", com 86 mensagens
 * paradas — o dono via "rodando" e nada era entregue.
 */
export declare const CAMPAIGN_AUTO_PAUSE_REASONS: readonly ["channel_disconnected", "channel_missing"];
export type CampaignAutoPauseReason = (typeof CAMPAIGN_AUTO_PAUSE_REASONS)[number];
export interface CampaignAutoPauseDetails {
    channelId?: string;
    channelName?: string;
    /** Erro do provider que motivou a pausa (ex.: 409 instância desconectada). */
    providerError?: string;
    /** Mensagem da campanha em que a falha apareceu — âncora para investigar. */
    campaignMessageId?: string;
}
export interface CampaignAutoPauseInfo {
    reason: CampaignAutoPauseReason;
    at: Date;
    details: CampaignAutoPauseDetails;
}
/** Forma na API (`at` em ISO). */
export interface CampaignAutoPauseResponse {
    reason: CampaignAutoPauseReason;
    at: string;
    details: CampaignAutoPauseDetails;
}
/**
 * Campaign Status
 */
export declare enum CampaignStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    PAUSED = "paused",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
/**
 * Audience Type - Tipo de audiência da campanha
 */
export declare enum AudienceType {
    LEADS = "leads",// Leads collection (via contactId)
    CONTACTS = "contacts",// Contacts collection
    CUSTOM_AUDIENCE = "custom_audience"
}
/**
 * Human-readable labels for AudienceType values.
 * Single source of truth — consumed by the UI to render campaign metadata.
 */
export declare const AUDIENCE_TYPE_LABELS: Record<AudienceType, string>;
/**
 * Audience Filter - Filtros para seleção de audiência
 */
export interface AudienceFilter {
    search?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
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
    fieldName?: string;
    staticValue?: string;
}
/**
 * Scheduling Type - Tipo de agendamento
 */
export declare enum SchedulingType {
    IMMEDIATE = "immediate",// Enviar imediatamente
    SCHEDULED = "scheduled",// Enviar em data/hora específica
    RECURRING = "recurring"
}
/**
 * Human-readable labels for SchedulingType values.
 * Single source of truth — consumed by the UI to render campaign metadata.
 */
export declare const SCHEDULING_TYPE_LABELS: Record<SchedulingType, string>;
/**
 * Recurring Config - Configuração de recorrência
 */
export interface RecurringConfig {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    hour: number;
    minute: number;
    timezone: string;
    endDate?: string;
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
    startedAt?: string;
    completedAt?: string;
    /** Quando a PRIMEIRA mensagem da campanha está agendada para sair. ISO string. */
    firstDispatchAt?: string;
    /** Quando a ÚLTIMA mensagem está agendada, no ritmo atual do canal. ISO string. */
    estimatedCompletionAt?: string;
}
/**
 * Campaign Response - Response type sem _id
 */
export interface CampaignResponse extends Omit<Campaign, '_id' | 'autoPause'> {
    id: string;
    /** `at` chega em ISO na API — mesmo padrão de `WorkflowResponse.autoPause`. */
    autoPause?: CampaignAutoPauseResponse;
}
/**
 * Campaign List Response
 */
export interface CampaignListResponse extends ListResponse<CampaignResponse> {
}
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
    audienceId?: string;
    variableMapping: VariableMapping;
    schedulingType: SchedulingType;
    scheduledFor?: string | null;
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
    audienceId?: string;
    variableMapping?: VariableMapping;
    schedulingType?: SchedulingType;
    scheduledFor?: string | null;
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
    deliveryRate: number;
    readRate: number;
    failureRate: number;
    startedAt?: string;
    completedAt?: string;
    duration?: number;
}
/**
 * Test Campaign Request
 */
export interface TestCampaignRequest {
    testRecipients: string[];
    variableMapping: VariableMapping;
}
/**
 * Campaign Message Status - Status de cada mensagem individual
 */
export declare enum CampaignMessageStatus {
    PENDING = "pending",// Aguardando envio
    QUEUED = "queued",// Na fila do BullMQ
    SENDING = "sending",// Em processo de envio
    SENT = "sent",// Enviado ao provider
    DELIVERED = "delivered",// Entregue ao destinatário
    READ = "read",// Lido pelo destinatário
    FAILED = "failed",// Falhou no envio
    CANCELLED = "cancelled"
}
/**
 * Campaign Message - Documento de tracking por destinatário
 */
export interface CampaignMessage extends TenantAwareDocument {
    campaignId: string;
    recipientId: string;
    recipientIdentifier: string;
    recipientName?: string;
    recipientData?: Record<string, unknown>;
    status: CampaignMessageStatus;
    providerMessageId?: string;
    sentAt?: string;
    deliveredAt?: string;
    readAt?: string;
    failedAt?: string;
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
export interface CampaignMessageListResponse extends ListResponse<CampaignMessageResponse> {
}
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
    campaignMessageId: string;
    campaignId: string;
    channelId: string;
    templateId: string;
    recipientIdentifier: string;
    recipientName?: string;
    variables: Record<string, string>;
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

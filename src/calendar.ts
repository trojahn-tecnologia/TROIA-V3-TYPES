import { ObjectId } from 'mongodb';
import { FullBaseDocument } from './common';
import { PaginationQuery, ListResponse } from './common';

/**
 * Calendar Event Type
 * Defines the type of calendar event
 */
export type CalendarEventType = 'meeting' | 'task' | 'reminder' | 'other' | 'follow_up' | 'birthday' | 'activity';

/**
 * Calendar Event - Complete structure compatible with Google Calendar
 * Supports multi-provider sync and activities integration
 */
export interface CalendarEvent extends FullBaseDocument {
  userId: string;                    // Event owner
  companyId: ObjectId;
  appId: ObjectId;

  // Event Type
  eventType: CalendarEventType;      // Type of event (meeting | task | reminder | other | follow_up)

  // Contact relationship (for follow_up events)
  contactId?: string;                // Contact ID (optional - used with follow_up type)

  // Activity relationship (optional)
  activityId?: string;               // Generated activity when event created/modified

  // Content
  summary: string;                   // Event title
  description?: string;              // Detailed description
  location?: string;                 // Physical or virtual location
  colorId?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';  // Google Calendar color ID

  // Timing - Supports timed events OR all-day events
  startTime: string;                 // ISO 8601 dateTime OR date (YYYY-MM-DD)
  endTime: string;                   // ISO 8601 dateTime OR date
  timeZone: string;                  // IANA timezone (America/Sao_Paulo)
  allDay: boolean;                   // true = all-day event

  // Recurrence (Google Calendar RRULE format)
  recurrence?: string[];             // ["RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"]
  recurringEventId?: string;         // Parent event ID (for instances)
  originalStartTime?: string;        // Original timestamp (for exceptions)

  // Availability
  transparency: 'opaque' | 'transparent';  // Blocks calendar or not
  visibility: 'default' | 'public' | 'private' | 'confidential';
  status: 'confirmed' | 'tentative' | 'cancelled';

  // Attendees (WITH contactId for relationship)
  attendees?: Array<{
    contactId?: string;              // Contact ID from contacts collection
    userId?: string;                 // Internal user ID (if company user)
    email: string;
    displayName: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    optional: boolean;
    organizer: boolean;
  }>;

  // Reminders
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup' | 'notification';
      minutes: number;
    }>;
  };

  // MULTI-PROVIDER SYNC (Array instead of fixed fields)
  providerSync: Array<{
    integrationId: string;           // user-integration ID
    providerId: string;              // Provider ID (google_calendar, outlook_calendar)
    providerEventId: string;         // Event ID in provider
    syncStatus: 'pending' | 'synced' | 'failed';
    lastSyncAt: string;              // ISO 8601
    syncError?: string;              // Error message if failed
    metadata?: Record<string, unknown>;  // Provider-specific data
  }>;

  // Conference/Meeting Link
  conferenceData?: {
    provider: 'google_meet' | 'zoom' | 'teams' | 'custom';
    link?: string;
    meetingId?: string;
  };

  // Metadata
  iCalUID?: string;                  // RFC 5545 UID
  sequence?: number;                 // Event version
}

/**
 * Calendar Event Response Type
 * Exposes id as string instead of _id ObjectId
 */
export interface CalendarEventResponse extends Omit<CalendarEvent, '_id'> {
  id: string;
  source?: 'calendar' | 'contact' | 'activity';  // Origem do evento (default: 'calendar')
}

/**
 * Create Calendar Event Request
 */
export interface CreateCalendarEventRequest {
  userId?: string;                     // Event owner (optional - defaults to authenticated user)
  eventType?: CalendarEventType;       // Event type (optional - defaults to 'meeting')
  contactId?: string;                  // Contact ID (optional - used with follow_up type)
  summary: string;
  description?: string;
  location?: string;
  colorId?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';  // Google Calendar color ID
  startTime: string;
  endTime: string;
  timeZone?: string;
  allDay?: boolean;
  recurrence?: string[];
  transparency?: 'opaque' | 'transparent';
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  status?: 'confirmed' | 'tentative' | 'cancelled';

  // Attendees WITH contactId
  attendees?: Array<{
    contactId?: string;              // Link with contacts
    userId?: string;
    email: string;
    displayName?: string;
    optional?: boolean;
  }>;

  reminders?: {
    useDefault?: boolean;
    overrides?: Array<{
      method: 'email' | 'popup' | 'notification';
      minutes: number;
    }>;
  };

  // Conference/Video Call Creation (ONLY on create)
  createConference?: boolean;          // If true, create video conference link
  conferenceProviderId?: string;       // Integration ID to use for creating conference

  // Conference Data (readonly - populated by provider)
  conferenceData?: {
    provider: 'google_meet' | 'zoom' | 'teams' | 'custom';
    link?: string;
    meetingId?: string;
  };

  // MULTI-PROVIDER SYNC (same as CalendarEvent)
  providerSync?: Array<{
    integrationId: string;
    providerId: string;
    providerEventId?: string;         // Optional (filled after creating in provider)
    syncStatus: 'pending' | 'synced' | 'failed';
    lastSyncAt?: string;              // ISO 8601
    syncError?: string;
    metadata?: Record<string, unknown>;
  }>;
}

/**
 * Update Calendar Event Request
 * ⚠️ conferenceData, createConference, conferenceProviderId are NOT editable (only on create)
 */
export interface UpdateCalendarEventRequest extends Omit<Partial<CreateCalendarEventRequest>, 'conferenceData' | 'createConference' | 'conferenceProviderId'> {
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

/**
 * Create Follow-Up Request
 * Simplified interface for creating follow-up events linked to contacts
 */
export interface CreateFollowUpRequest {
  contactId: string;                   // Contact ID (required)
  summary: string;                     // Event title
  description?: string;                // Event description
  startTime: string;                   // ISO 8601 dateTime OR date (YYYY-MM-DD)
  endTime: string;                     // ISO 8601 dateTime OR date
  timeZone?: string;                   // IANA timezone (defaults to America/Sao_Paulo)
  allDay?: boolean;                    // All-day event flag (default: false)
  recurrence?: string[];               // RRULE format (e.g., ["RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"])
  colorId?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';  // Google Calendar color ID
}

/**
 * Calendar Event Query Filters
 */
export interface CalendarEventQuery extends PaginationQuery {
  filters?: {
    userId?: string;
    eventType?: CalendarEventType;   // Filter by event type
    contactId?: string;              // Filter by contact ID (for follow_up events)
    hasContactId?: boolean;          // Filter events that have any contactId (true) or no contactId (false)
    startTimeFrom?: string;
    startTimeTo?: string;
    status?: 'confirmed' | 'tentative' | 'cancelled';
    transparency?: 'opaque' | 'transparent';
    visibility?: 'default' | 'public' | 'private' | 'confidential';
    hasAttendees?: boolean;
    isRecurring?: boolean;
    providerSyncStatus?: 'pending' | 'synced' | 'failed';  // Filters if ANY provider has this status
    providerId?: string;  // Filters events synced with specific provider
  };
}

/**
 * Calendar Event List Response
 */
export interface CalendarEventListResponse extends ListResponse<CalendarEventResponse> {}

/**
 * Multi-Provider Sync Request
 */
export interface SyncCalendarRequest {
  integrationIds: string[];          // Array of integrations to sync
  syncDirection: 'pull' | 'push' | 'bidirectional';
  timeMin?: string;                  // Start date for sync
  timeMax?: string;                  // End date for sync
}

/**
 * Sync Result per Provider
 */
export interface ProviderSyncResult {
  integrationId: string;
  providerId: string;
  eventsSynced: number;
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  errors: Array<{ eventId: string; error: string }>;
}

/**
 * Multi-Provider Sync Response
 */
export interface SyncCalendarResponse {
  success: boolean;
  syncResults: ProviderSyncResult[];
}

/**
 * Event Attendee (for frontend forms)
 */
export interface EventAttendee {
  contactId?: string;
  userId?: string;
  email: string;
  displayName: string;
  responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  optional: boolean;
  organizer: boolean;
}

/**
 * Provider Sync Status (for UI badges)
 */
export interface ProviderSyncStatus {
  integrationId: string;
  providerId: string;
  providerEventId: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  lastSyncAt: string;
  syncError?: string;
}

/**
 * Event Recurrence Types (RRULE helpers)
 */
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurrenceRule {
  freq: RecurrenceFrequency;
  interval?: number;
  count?: number;
  until?: string;
  byday?: string[];      // MO, TU, WE, TH, FR, SA, SU
  bymonthday?: number[]; // 1-31
  bymonth?: number[];    // 1-12
}

/**
 * Calendar Event Statistics (for dashboard)
 */
export interface CalendarEventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  recurringEvents: number;
  eventsWithAttendees: number;
  syncedEvents: number;
  pendingSyncEvents: number;
  failedSyncEvents: number;
}

// ============================================================================
// FOLLOW-UP AUTOMATION TYPES
// ============================================================================

/**
 * Tipos de condição para execução de follow-ups
 */
export type FollowUpConditionType =
  | 'no_response'           // Contato não respondeu em X horas
  | 'time_elapsed'          // X horas se passaram desde última interação
  | 'tag_added'             // Tag específica foi adicionada ao contato
  | 'no_event_scheduled';   // Não existe evento agendado para o contato

/**
 * Tipos de ação a executar quando condição é satisfeita
 */
export type FollowUpActionType =
  | 'send_message'       // Enviar mensagem via WhatsApp
  | 'send_notification'  // Enviar notificação para usuários
  | 'assign_user'        // Atribuir conversa a usuário específico
  | 'assign_ai_agent'    // Atribuir conversa a agente de IA
  | 'add_tag'            // Adicionar tag ao contato
  | 'webhook'            // Chamar webhook externo
  | 'move_to_step';      // Mover lead para outra etapa do funil

/**
 * Configuração de condição para follow-up
 */
export interface FollowUpCondition {
  type: FollowUpConditionType;
  config: {
    // no_response: horas sem resposta do contato
    hours?: number;

    // tag_added: ID da tag que deve existir
    tagId?: string;
  };
}

/**
 * Configuração de ação para follow-up
 */
export interface FollowUpAction {
  type: FollowUpActionType;
  config: {
    // send_message: conteúdo da mensagem
    message?: string;

    // send_notification: configuração de notificação
    notificationTitle?: string;
    notificationBody?: string;
    notifyUserIds?: string[];  // IDs dos usuários a notificar

    // assign_user: ID do usuário para atribuição
    userId?: string;

    // assign_ai_agent: ID do agente de IA
    aiAgentId?: string;

    // add_tag: ID da tag a adicionar
    tagId?: string;

    // webhook: URL e payload
    webhookUrl?: string;
    webhookPayload?: Record<string, unknown>;
    webhookHeaders?: Record<string, string>;

    // move_to_step: ID do funil e da etapa destino
    funnelId?: string;
    stepId?: string;
  };
}

/**
 * Tipo de intervalo de recorrência para follow-ups
 */
export type FollowUpRecurrenceInterval =
  | 'once'           // Executar apenas uma vez
  | 'hourly'         // A cada hora
  | 'daily'          // Diariamente
  | 'weekly'         // Semanalmente
  | 'monthly'        // Mensalmente
  | 'minutes';       // Intervalo customizado em minutos

/**
 * Configuração completa de automação de follow-up
 */
export interface FollowUpAutomation {
  condition?: FollowUpCondition;   // Opcional - follow-ups podem não ter condição
  actions?: FollowUpAction[];      // Opcional - follow-ups podem não ter ações

  // Controle de execução
  maxExecutions?: number;          // Máximo de execuções (undefined = infinito)
  executionCount?: number;         // Contador de execuções realizadas
  lastExecutedAt?: string;         // ISO 8601 - última execução
  nextExecutionAt?: string;        // ISO 8601 - próxima execução calculada

  // Configuração de recorrência
  recurrenceInterval?: FollowUpRecurrenceInterval;  // Tipo de intervalo
  customIntervalMinutes?: number;  // Minutos para intervalo customizado

  // Status
  status: 'active' | 'paused' | 'completed';  // completed quando maxExecutions atingido
}

/**
 * Extensão do CalendarEvent para follow-ups com automação
 */
export interface FollowUpEvent extends CalendarEvent {
  eventType: 'follow_up';
  contactId: string;             // Obrigatório para follow-ups

  // Automação (opcional - follow-ups podem ser apenas lembretes manuais)
  automation?: FollowUpAutomation;
}

/**
 * Follow-Up Event Response Type
 * Extends CalendarEventResponse (which has id: string) with follow-up specific fields
 */
export interface FollowUpEventResponse extends CalendarEventResponse {
  eventType: 'follow_up';
  contactId: string;             // Obrigatório para follow-ups

  // Automação (opcional - follow-ups podem ser apenas lembretes manuais)
  automation?: FollowUpAutomation;
}

/**
 * Request para criar follow-up com automação
 */
export interface CreateFollowUpWithAutomationRequest extends CreateFollowUpRequest {
  automation?: {
    condition: FollowUpCondition;
    actions: FollowUpAction[];
    maxExecutions?: number;
  };
}

/**
 * Job data para queue de execução de follow-ups
 */
export interface FollowUpExecutionJobData {
  followUpId: string;            // ID do evento de follow-up
  contactId: string;             // ID do contato
  appId: string;                 // Multi-tenant: App ID
  companyId: string;             // Multi-tenant: Company ID
  automation: FollowUpAutomation;
  scheduledFor: string;          // ISO 8601 - quando deveria executar
}

/**
 * Resultado de avaliação de condição
 */
export interface ConditionEvaluationResult {
  shouldExecute: boolean;
  reason: string;
  metadata?: Record<string, unknown>;
}

/**
 * Resultado de execução de ação
 */
export interface ActionExecutionResult {
  success: boolean;
  actionType: FollowUpActionType;
  message: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Resultado completo de execução de follow-up
 */
export interface FollowUpExecutionResult {
  followUpId: string;
  contactId: string;
  conditionResult: ConditionEvaluationResult;
  actionResults: ActionExecutionResult[];
  executedAt: string;            // ISO 8601
  success: boolean;
  totalActionsExecuted: number;
  totalActionsFailed: number;
}

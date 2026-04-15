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
    userId: string;
    companyId: ObjectId;
    appId: ObjectId;
    eventType: CalendarEventType;
    contactId?: string;
    activityId?: string;
    summary: string;
    description?: string;
    location?: string;
    colorId?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';
    startTime: string;
    endTime: string;
    timeZone: string;
    allDay: boolean;
    recurrence?: string[];
    recurringEventId?: string;
    originalStartTime?: string;
    transparency: 'opaque' | 'transparent';
    visibility: 'default' | 'public' | 'private' | 'confidential';
    status: 'confirmed' | 'tentative' | 'cancelled';
    attendees?: Array<{
        contactId?: string;
        userId?: string;
        email: string;
        displayName: string;
        responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
        optional: boolean;
        organizer: boolean;
    }>;
    reminders?: {
        useDefault: boolean;
        overrides?: Array<{
            method: 'email' | 'popup' | 'notification';
            minutes: number;
        }>;
    };
    providerSync: Array<{
        integrationId: string;
        providerId: string;
        providerEventId: string;
        syncStatus: 'pending' | 'synced' | 'failed';
        lastSyncAt: string;
        syncError?: string;
        metadata?: Record<string, unknown>;
    }>;
    conferenceData?: {
        provider: 'google_meet' | 'zoom' | 'teams' | 'custom';
        link?: string;
        meetingId?: string;
    };
    iCalUID?: string;
    sequence?: number;
}
/**
 * Calendar Event Response Type
 * Exposes id as string instead of _id ObjectId
 */
export interface CalendarEventResponse extends Omit<CalendarEvent, '_id'> {
    id: string;
    source?: 'calendar' | 'contact' | 'activity';
}
/**
 * Create Calendar Event Request
 */
export interface CreateCalendarEventRequest {
    userId?: string;
    eventType?: CalendarEventType;
    contactId?: string;
    summary: string;
    description?: string;
    location?: string;
    colorId?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';
    startTime: string;
    endTime: string;
    timeZone?: string;
    allDay?: boolean;
    recurrence?: string[];
    transparency?: 'opaque' | 'transparent';
    visibility?: 'default' | 'public' | 'private' | 'confidential';
    status?: 'confirmed' | 'tentative' | 'cancelled';
    attendees?: Array<{
        contactId?: string;
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
    createConference?: boolean;
    conferenceProviderId?: string;
    conferenceData?: {
        provider: 'google_meet' | 'zoom' | 'teams' | 'custom';
        link?: string;
        meetingId?: string;
    };
    providerSync?: Array<{
        integrationId: string;
        providerId: string;
        providerEventId?: string;
        syncStatus: 'pending' | 'synced' | 'failed';
        lastSyncAt?: string;
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
    contactId: string;
    summary: string;
    description?: string;
    startTime: string;
    endTime: string;
    timeZone?: string;
    allDay?: boolean;
    recurrence?: string[];
    colorId?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11';
}
/**
 * Calendar Event Query Filters
 */
export interface CalendarEventQuery extends PaginationQuery {
    filters?: {
        userId?: string;
        eventType?: CalendarEventType;
        contactId?: string;
        hasContactId?: boolean;
        startTimeFrom?: string;
        startTimeTo?: string;
        status?: 'confirmed' | 'tentative' | 'cancelled';
        transparency?: 'opaque' | 'transparent';
        visibility?: 'default' | 'public' | 'private' | 'confidential';
        hasAttendees?: boolean;
        isRecurring?: boolean;
        providerSyncStatus?: 'pending' | 'synced' | 'failed';
        providerId?: string;
    };
}
/**
 * Calendar Event List Response
 */
export interface CalendarEventListResponse extends ListResponse<CalendarEventResponse> {
}
/**
 * Multi-Provider Sync Request
 */
export interface SyncCalendarRequest {
    integrationIds: string[];
    syncDirection: 'pull' | 'push' | 'bidirectional';
    timeMin?: string;
    timeMax?: string;
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
    errors: Array<{
        eventId: string;
        error: string;
    }>;
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
    byday?: string[];
    bymonthday?: number[];
    bymonth?: number[];
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
/**
 * Tipos de condição para execução de follow-ups
 */
export type FollowUpConditionType = 'no_response' | 'time_elapsed' | 'tag_added' | 'no_event_scheduled';
/**
 * Tipos de ação a executar quando condição é satisfeita
 */
export type FollowUpActionType = 'send_message' | 'send_notification' | 'assign_user' | 'assign_ai_agent' | 'add_tag' | 'webhook' | 'move_to_step';
/**
 * Configuração de condição para follow-up
 */
export interface FollowUpCondition {
    type: FollowUpConditionType;
    config: {
        hours?: number;
        tagId?: string;
    };
}
/**
 * Configuração de ação para follow-up
 */
export interface FollowUpAction {
    type: FollowUpActionType;
    config: {
        message?: string;
        notificationTitle?: string;
        notificationBody?: string;
        notifyUserIds?: string[];
        userId?: string;
        aiAgentId?: string;
        tagId?: string;
        webhookUrl?: string;
        webhookPayload?: Record<string, unknown>;
        webhookHeaders?: Record<string, string>;
        funnelId?: string;
        stepId?: string;
    };
}
/**
 * Tipo de intervalo de recorrência para follow-ups
 */
export type FollowUpRecurrenceInterval = 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'minutes';
/**
 * Configuração completa de automação de follow-up
 */
export interface FollowUpAutomation {
    condition?: FollowUpCondition;
    actions?: FollowUpAction[];
    maxExecutions?: number;
    executionCount?: number;
    lastExecutedAt?: string;
    nextExecutionAt?: string;
    recurrenceInterval?: FollowUpRecurrenceInterval;
    customIntervalMinutes?: number;
    status: 'active' | 'paused' | 'completed';
}
/**
 * Extensão do CalendarEvent para follow-ups com automação
 */
export interface FollowUpEvent extends CalendarEvent {
    eventType: 'follow_up';
    contactId: string;
    automation?: FollowUpAutomation;
}
/**
 * Follow-Up Event Response Type
 * Extends CalendarEventResponse (which has id: string) with follow-up specific fields
 */
export interface FollowUpEventResponse extends CalendarEventResponse {
    eventType: 'follow_up';
    contactId: string;
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
    followUpId: string;
    contactId: string;
    appId: string;
    companyId: string;
    automation: FollowUpAutomation;
    scheduledFor: string;
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
    executedAt: string;
    success: boolean;
    totalActionsExecuted: number;
    totalActionsFailed: number;
}

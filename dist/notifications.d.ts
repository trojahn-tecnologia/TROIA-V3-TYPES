import { ObjectId } from 'mongodb';
/**
 * Tipos de notificação disponíveis no sistema
 */
export declare enum NotificationType {
    SYSTEM_MAINTENANCE = "system_maintenance",
    SYSTEM_UPDATE = "system_update",
    SYSTEM_ALERT = "system_alert",
    AUTH_FAILURE = "auth_failure",
    AUTH_SUCCESS = "auth_success",
    PASSWORD_RESET = "password_reset",
    TWO_FACTOR_ENABLED = "two_factor_enabled",
    INTEGRATION_CONNECTED = "integration_connected",
    INTEGRATION_DISCONNECTED = "integration_disconnected",
    INTEGRATION_ERROR = "integration_error",
    CALENDAR_SYNC_COMPLETE = "calendar_sync_complete",
    CALENDAR_SYNC_FAILED = "calendar_sync_failed",
    CHANNEL_DISCONNECTED = "channel_disconnected",
    CHANNEL_CONNECTED = "channel_connected",
    TICKET_ASSIGNED = "ticket_assigned",
    TICKET_STATUS_CHANGED = "ticket_status_changed",
    TICKET_COMMENT_ADDED = "ticket_comment_added",
    CONVERSATION_ASSIGNED = "conversation_assigned",
    CONVERSATION_MESSAGE_RECEIVED = "conversation_message_received",
    LEAD_ASSIGNED = "lead_assigned",
    LEAD_STATUS_CHANGED = "lead_status_changed",
    LEAD_ACTIVITY_ASSIGNED = "lead_activity_assigned",
    ESCALATION_TRIGGERED = "escalation_triggered",
    ESCALATION_REASSIGNED = "escalation_reassigned",
    PAYMENT_RECEIVED = "payment_received",
    PAYMENT_FAILED = "payment_failed",
    SUBSCRIPTION_RENEWED = "subscription_renewed",
    SUBSCRIPTION_EXPIRED = "subscription_expired",
    SUBSCRIPTION_CANCELED = "subscription_canceled",
    TEAM_MEMBER_ADDED = "team_member_added",
    TEAM_MEMBER_REMOVED = "team_member_removed",
    SHIFT_REMINDER = "shift_reminder",
    CUSTOM_NOTIFICATION = "custom_notification"
}
/**
 * Prioridade da notificação
 */
export declare enum NotificationPriority {
    LOW = "low",// Informacional, não urgente
    NORMAL = "normal",// Notificação padrão
    HIGH = "high",// Requer atenção
    URGENT = "urgent"
}
/**
 * Categoria da notificação para organização
 */
export declare enum NotificationCategory {
    SYSTEM = "system",
    SECURITY = "security",
    INTEGRATION = "integration",
    CHANNELS = "channels",
    TICKETS = "tickets",
    CONVERSATIONS = "conversations",
    LEADS = "leads",
    PAYMENT = "payment",
    TEAM = "team",
    CUSTOM = "custom"
}
/**
 * Canais de entrega disponíveis
 *
 * `sound` é canal first-class (2026-04-29): emite socket `notification:sound`
 * dedicado pra tocar áudio no cliente. Respeita preferences igual aos outros.
 */
export type NotificationChannel = 'email' | 'whatsapp' | 'push' | 'inApp' | 'sound';
/**
 * Sound keys disponíveis pro canal `sound`. Cada chave corresponde a um
 * arquivo de áudio em `public/assets/notifications/audio/` no frontend.
 *
 * O backend (`resolveSoundKey`) decide qual chave usar baseado em
 * `notification.type` + dados auxiliares. Adicionar tipo com som novo:
 *   1. registrar `'sound'` em NOTIFICATION_TYPE_SUPPORTED_CHANNELS
 *   2. acrescentar entrada nesse union (se for som novo)
 *   3. estender `resolveSoundKey` no backend
 *   4. registrar player no mapping `players` do frontend
 */
export type SoundKey = 'message' | 'queue' | 'lead' | 'ticket' | 'alert';
/**
 * Canais suportados por tipo de notificação.
 *
 * Mapa sparse: tipos AUSENTES aqui aceitam o conjunto default abaixo
 * (`['inApp', 'push', 'email', 'whatsapp']`). `'sound'` NÃO está no default —
 * é uma allowlist conservadora: cada tipo precisa listá-lo explicitamente
 * pra ganhar checkbox na UI de preferências e dispatch no backend. Hoje só
 * `CONVERSATION_MESSAGE_RECEIVED` declara, mas o caminho está aberto pra
 * outros tipos (ex: `TICKET_ASSIGNED`).
 */
export declare const NOTIFICATION_TYPE_SUPPORTED_CHANNELS: Partial<Record<NotificationType, NotificationChannel[]>>;
/**
 * Retorna os canais suportados pra um tipo. Default: 4 canais clássicos
 * (sem `sound` — opt-in explícito via mapa).
 */
export declare function getSupportedChannelsForType(type: NotificationType | string): NotificationChannel[];
/**
 * Status de entrega por canal
 */
export interface ChannelDeliveryStatus {
    channel: NotificationChannel;
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    error?: string;
    providerId?: string;
    providerResponse?: unknown;
}
/**
 * Entidade de notificação (Database schema)
 */
export interface SystemNotification {
    _id?: ObjectId;
    appId: ObjectId;
    companyId: ObjectId;
    userId: string;
    type: NotificationType;
    category: NotificationCategory;
    priority: NotificationPriority;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    channels: NotificationChannel[];
    deliveryStatus: ChannelDeliveryStatus[];
    read: boolean;
    readAt?: Date;
    archived: boolean;
    archivedAt?: Date;
    actionUrl?: string;
    actionLabel?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}
/**
 * Request para criar notificação
 */
export interface CreateNotificationRequest {
    userId: string;
    type: NotificationType;
    category: NotificationCategory;
    priority: NotificationPriority;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    channels?: NotificationChannel[];
    actionUrl?: string;
    actionLabel?: string;
    expiresAt?: string;
}
/**
 * Response de notificação (API)
 */
export interface NotificationResponse extends Omit<SystemNotification, '_id' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'readAt' | 'archivedAt' | 'expiresAt'> {
    id: string;
    appId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    readAt?: string;
    archivedAt?: string;
    expiresAt?: string;
}
/**
 * Response de listagem de notificações
 */
export interface NotificationListResponse {
    notifications: NotificationResponse[];
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
}
/**
 * Query parameters para listagem de notificações
 */
export interface NotificationQuery {
    page?: number;
    limit?: number;
    read?: boolean;
    archived?: boolean;
    type?: NotificationType;
    category?: NotificationCategory;
    priority?: NotificationPriority;
    dateFrom?: string;
    dateTo?: string;
}
/**
 * Request para marcar notificação como lida
 */
export interface MarkNotificationsAsReadRequest {
    notificationIds: string[];
}
/**
 * Request para arquivar notificação
 */
export interface ArchiveNotificationRequest {
    notificationIds: string[];
}
/**
 * Estatísticas de notificações (Dashboard)
 */
export interface NotificationStats {
    total: number;
    unread: number;
    byCategory: Record<NotificationCategory, number>;
    byPriority: Record<NotificationPriority, number>;
    recentNotifications: NotificationResponse[];
}
/**
 * Payload do evento Socket.IO para nova notificação
 */
export interface InAppNotificationEvent {
    notification: NotificationResponse;
    unreadCount: number;
}
/**
 * Payload do evento Socket.IO para marcar como lida
 */
export interface NotificationReadEvent {
    notificationIds: string[];
    unreadCount: number;
}

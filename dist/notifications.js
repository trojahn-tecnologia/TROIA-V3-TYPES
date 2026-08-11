"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPT_IN_NOTIFICATION_CHANNELS = exports.NOTIFICATION_TYPE_SUPPORTED_CHANNELS = exports.NotificationCategory = exports.NotificationPriority = exports.NotificationType = void 0;
exports.getSupportedChannelsForType = getSupportedChannelsForType;
exports.isOptInNotificationChannel = isOptInNotificationChannel;
// ============================================================================
// NOTIFICATION TYPES AND ENUMS
// ============================================================================
/**
 * Tipos de notificação disponíveis no sistema
 */
var NotificationType;
(function (NotificationType) {
    // System notifications
    NotificationType["SYSTEM_MAINTENANCE"] = "system_maintenance";
    NotificationType["SYSTEM_UPDATE"] = "system_update";
    NotificationType["SYSTEM_ALERT"] = "system_alert";
    // Authentication and security
    NotificationType["AUTH_FAILURE"] = "auth_failure";
    NotificationType["AUTH_SUCCESS"] = "auth_success";
    NotificationType["PASSWORD_RESET"] = "password_reset";
    NotificationType["TWO_FACTOR_ENABLED"] = "two_factor_enabled";
    // Integration events
    NotificationType["INTEGRATION_CONNECTED"] = "integration_connected";
    NotificationType["INTEGRATION_DISCONNECTED"] = "integration_disconnected";
    NotificationType["INTEGRATION_ERROR"] = "integration_error";
    NotificationType["CALENDAR_SYNC_COMPLETE"] = "calendar_sync_complete";
    NotificationType["CALENDAR_SYNC_FAILED"] = "calendar_sync_failed";
    // Channel events (System Alerts)
    NotificationType["CHANNEL_DISCONNECTED"] = "channel_disconnected";
    NotificationType["CHANNEL_CONNECTED"] = "channel_connected";
    // Ticket and conversation events
    NotificationType["TICKET_ASSIGNED"] = "ticket_assigned";
    NotificationType["TICKET_STATUS_CHANGED"] = "ticket_status_changed";
    NotificationType["TICKET_COMMENT_ADDED"] = "ticket_comment_added";
    NotificationType["CONVERSATION_ASSIGNED"] = "conversation_assigned";
    NotificationType["CONVERSATION_MESSAGE_RECEIVED"] = "conversation_message_received";
    // Projects
    NotificationType["PROJECT_TASK_UNBLOCKED"] = "project_task_unblocked";
    NotificationType["PROJECT_TASK_COMPLETED"] = "project_task_completed";
    NotificationType["PROJECT_COMPLETED"] = "project_completed";
    NotificationType["PROJECT_TASK_OVERDUE"] = "project_task_overdue";
    // Lead events
    NotificationType["LEAD_ASSIGNED"] = "lead_assigned";
    NotificationType["LEAD_STATUS_CHANGED"] = "lead_status_changed";
    NotificationType["LEAD_ACTIVITY_ASSIGNED"] = "lead_activity_assigned";
    // Lead inactivity alerts (2026-07-17)
    NotificationType["LEAD_ALERT_WARNING"] = "lead_alert_warning";
    NotificationType["LEAD_ALERT_CRITICAL"] = "lead_alert_critical";
    NotificationType["LEAD_WEEKLY_DIGEST"] = "lead_weekly_digest";
    // Escalation events
    NotificationType["ESCALATION_TRIGGERED"] = "escalation_triggered";
    NotificationType["ESCALATION_REASSIGNED"] = "escalation_reassigned";
    // Payment events
    NotificationType["PAYMENT_RECEIVED"] = "payment_received";
    NotificationType["PAYMENT_FAILED"] = "payment_failed";
    NotificationType["SUBSCRIPTION_RENEWED"] = "subscription_renewed";
    NotificationType["SUBSCRIPTION_EXPIRED"] = "subscription_expired";
    NotificationType["SUBSCRIPTION_CANCELED"] = "subscription_canceled";
    // Team events
    NotificationType["TEAM_MEMBER_ADDED"] = "team_member_added";
    NotificationType["TEAM_MEMBER_REMOVED"] = "team_member_removed";
    NotificationType["SHIFT_REMINDER"] = "shift_reminder";
    // Calendar / agenda (2026-07-24)
    NotificationType["EVENT_REMINDER"] = "event_reminder";
    NotificationType["AGENDA_DAILY_SUMMARY"] = "agenda_daily_summary";
    // Custom notifications
    NotificationType["CUSTOM_NOTIFICATION"] = "custom_notification";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Prioridade da notificação
 */
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["NORMAL"] = "normal";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
/**
 * Categoria da notificação para organização
 */
var NotificationCategory;
(function (NotificationCategory) {
    NotificationCategory["SYSTEM"] = "system";
    NotificationCategory["SECURITY"] = "security";
    NotificationCategory["INTEGRATION"] = "integration";
    NotificationCategory["CHANNELS"] = "channels";
    NotificationCategory["TICKETS"] = "tickets";
    NotificationCategory["CONVERSATIONS"] = "conversations";
    NotificationCategory["LEADS"] = "leads";
    NotificationCategory["PAYMENT"] = "payment";
    NotificationCategory["TEAM"] = "team";
    NotificationCategory["CALENDAR"] = "calendar";
    NotificationCategory["CUSTOM"] = "custom";
})(NotificationCategory || (exports.NotificationCategory = NotificationCategory = {}));
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
exports.NOTIFICATION_TYPE_SUPPORTED_CHANNELS = {
    [NotificationType.CONVERSATION_MESSAGE_RECEIVED]: ['push', 'sound'],
    // Conversa Atribuída: SEM 'email' — não é oferecido na UI de preferências
    // nem despachado por email (quem já tinha ativado deixa de receber, pois o
    // dispatch filtra pelos canais suportados). Lead/Ticket atribuído mantêm email.
    [NotificationType.CONVERSATION_ASSIGNED]: ['inApp', 'push', 'whatsapp'],
    // Agenda: lembrete de evento respeita o método configurado no evento
    // (popup/notification → inApp/push; email → email). Resumo diário só in-app/push.
    [NotificationType.EVENT_REMINDER]: ['inApp', 'push', 'email'],
    [NotificationType.AGENDA_DAILY_SUMMARY]: ['inApp', 'push'],
};
/**
 * Retorna os canais suportados pra um tipo. Default: 4 canais clássicos
 * (sem `sound` — opt-in explícito via mapa).
 */
function getSupportedChannelsForType(type) {
    const restricted = exports.NOTIFICATION_TYPE_SUPPORTED_CHANNELS[type];
    return restricted ?? ['inApp', 'push', 'email', 'whatsapp'];
}
/**
 * Canais **opt-in** (2026-07-23): `enabled: true` sozinho não basta — o user
 * precisa escolher os tipos. Nesses canais `types: undefined` significa
 * "nenhum tipo escolhido" e o dispatch NÃO envia.
 *
 * Nos demais (inApp/push/sound, default-on) `types: undefined` significa
 * "nunca configurou" e permite TODOS os tipos.
 *
 * ⚠️ Fonte única do contrato — consumir via `isOptInNotificationChannel` no
 * backend (`determineChannels`) E no frontend (checkbox da tela de
 * preferências). Duplicar a regra em cada lado já causou incidente: a UI
 * marcava o checkbox como ligado enquanto o dispatch tratava como desligado,
 * e usuários com WhatsApp "ativo" na tela nunca recebiam (2026-08-11).
 */
exports.OPT_IN_NOTIFICATION_CHANNELS = ['email', 'whatsapp'];
/**
 * `true` quando o canal exige escolha explícita de tipos (`types: undefined`
 * = não envia). Ver `OPT_IN_NOTIFICATION_CHANNELS`.
 */
function isOptInNotificationChannel(channel) {
    return exports.OPT_IN_NOTIFICATION_CHANNELS.includes(channel);
}

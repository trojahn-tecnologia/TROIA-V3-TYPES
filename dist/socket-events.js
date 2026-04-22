"use strict";
/**
 * Socket.IO Event Types - Shared between Frontend and Backend
 *
 * Prevents event name mismatches and ensures type safety for socket events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_ROOMS = exports.SOCKET_EVENTS = void 0;
// ============================================================================
// EVENT NAMES (String Literals for Type Safety)
// ============================================================================
exports.SOCKET_EVENTS = {
    // Conversation Events
    CONVERSATION_MESSAGE: 'conversation:message',
    CONVERSATION_UPDATED: 'conversation:updated',
    CONVERSATION_DELETED: 'conversation:deleted',
    CONVERSATION_OPEN: 'conversation:open', // ✅ Arch 3.4: User opens conversation
    CONVERSATION_UNREAD_RESET: 'conversation:unread-reset', // ✅ Arch 3.4: Unread counter reset
    CONVERSATION_ERROR: 'conversation:error', // ✅ Arch 3.4: Error in conversation operations
    UNREAD_COUNT_UPDATE: 'unread-count:update', // ✅ Optimization: Backend sends updated counters
    // ✅ Transient notification trigger — emitido user-specific APENAS para
    // destinatários elegíveis (não-mutados) quando chega mensagem inbound.
    // Presença do evento = permissão pra tocar toast+som. Diferente de
    // CONVERSATION_MESSAGE (broadcast pra UI state), este é dedicado ao
    // gatilho de notificação — sem cache no frontend, sem leak de mutedBy.
    CONVERSATION_MESSAGE_NOTIFY: 'conversation:message:notify',
    // Message Events
    MESSAGE_STATUS: 'message:status', // ✅ Generic status update (sent, delivered, read, failed)
    MESSAGE_DELIVERED: 'message:delivered',
    MESSAGE_READ: 'message:read',
    MESSAGE_DELETED: 'message:deleted',
    MESSAGE_REACTION: 'message:reaction', // ✅ Reaction added/removed on a message
    MESSAGE_EDITED: 'message:edited', // ✅ Message content edited (inbound via webhook / outbound via UI)
    // Channel Events
    CHANNEL_QR: 'channel:qr',
    CHANNEL_CONNECTED: 'channel:connected',
    CHANNEL_DISCONNECTED: 'channel:disconnected',
    CHANNEL_ACCOUNT_UPDATED: 'channel:account-updated', // ✅ Info da conta conectada atualizada (foto, push name, etc.)
    // User Events
    USER_TYPING: 'user:typing',
    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline',
    // Assignment Events
    ASSIGNMENT_CREATED: 'assignment:created',
    ASSIGNMENT_UPDATED: 'assignment:updated',
    ASSIGNMENT_COMPLETED: 'assignment:completed',
    // Contact Events
    CONTACT_IDENTIFIERS_SYNCED: 'contact:identifiers:synced',
    CONTACT_SYNC_FAILED: 'contact:sync:failed',
    // Integration Sync Events
    INTEGRATION_SYNC_STARTED: 'integration:sync-started',
    INTEGRATION_SYNC_PROGRESS: 'integration:sync-progress',
    INTEGRATION_SYNC_COMPLETED: 'integration:sync-completed',
    INTEGRATION_SYNC_FAILED: 'integration:sync-failed',
    // Database Sync Events
    DATABASE_SYNC_STARTED: 'database:sync-started',
    DATABASE_SYNC_PROGRESS: 'database:sync-progress',
    DATABASE_SYNC_COMPLETED: 'database:sync-completed',
    DATABASE_SYNC_FAILED: 'database:sync-failed',
    // Notification Events
    NOTIFICATION_NEW: 'notification:new',
    NOTIFICATION_READ: 'notification:read',
    // Template Events
    TEMPLATE_STATUS_UPDATED: 'template:status-updated',
    // AI Agent Events
    AI_AGENT_EXECUTED: 'ai:agent:executed',
    // Campaign Events
    CAMPAIGN_MESSAGE_STATUS: 'campaign:message-status', // Individual message status update
    CAMPAIGN_PROGRESS: 'campaign:progress', // Overall campaign progress
    CAMPAIGN_COMPLETED: 'campaign:completed', // Campaign finished
    // Audience Events
    AUDIENCE_IMPORT_STARTED: 'audience:import-started',
    AUDIENCE_IMPORT_PROGRESS: 'audience:import-progress',
    AUDIENCE_IMPORT_COMPLETED: 'audience:import-completed',
    AUDIENCE_IMPORT_FAILED: 'audience:import-failed',
    // Team Chat Events (internal user-to-user chat)
    TEAM_MESSAGE: 'team:message', // New message sent/received
    TEAM_MESSAGE_READ: 'team:message:read', // Message marked as read
    TEAM_TYPING: 'team:typing', // Typing indicator
    TEAM_USER_ONLINE: 'team:user:online', // User came online
    TEAM_USER_OFFLINE: 'team:user:offline', // User went offline
    TEAM_UNREAD_COUNT: 'team:unread-count', // Unread count update
    TEAM_HEARTBEAT: 'team:heartbeat', // Client heartbeat to keep presence alive
    // Credit Payment Events
    CREDIT_PAYMENT_CONFIRMED: 'credit:payment:confirmed', // PIX payment confirmed via webhook
};
// ============================================================================
// ROOM PATTERNS
// ============================================================================
exports.SOCKET_ROOMS = {
    /**
     * Company room - all users of a company
     * Pattern: company:{companyId}
     */
    company: (companyId) => `company:${companyId}`,
    /**
     * Conversation room - users in a specific conversation
     * Pattern: conversation:{conversationId}
     */
    conversation: (conversationId) => `conversation:${conversationId}`,
    /**
     * User room - specific user
     * Pattern: user:{userId}
     */
    user: (userId) => `user:${userId}`,
    /**
     * Channel room - specific channel
     * Pattern: channel:{channelId}
     */
    channel: (channelId) => `channel:${channelId}`,
};

/**
 * Structured Media Data Object
 * Enhanced media object with comprehensive metadata
 *
 * @since v2.1.0 - Replaces simple mediaUrl/mediaType pattern
 */
export interface MediaData {
    /** Final URL of the media (S3, CDN, or other permanent storage) */
    url: string;
    /** Type of media content */
    type: 'image' | 'video' | 'audio' | 'document' | 'sticker';
    /** Original filename or generated name */
    filename?: string;
    /** File size in bytes */
    size?: number;
    /** MIME type (image/jpeg, video/mp4, etc.) */
    mimeType?: string;
    /** Width in pixels (for images/videos) */
    width?: number;
    /** Height in pixels (for images/videos) */
    height?: number;
    /** Duration in seconds (for audio/video) */
    duration?: number;
    /** Caption or description */
    caption?: string;
    /** Whether content is animated (for stickers) */
    isAnimated?: boolean;
}
/**
 * Message Sender Information
 * Structured sender data (contact or business account)
 *
 * @since v2.2.0 - Structured sender information with profile data
 */
export interface MessageSender {
    /** WhatsApp identifier (JID or LID) - OBRIGATÓRIO */
    id: string;
    /** Display name from WhatsApp profile */
    name?: string;
    /** Phone number (DDI+DDD+NUMBER) - OPCIONAL (não existe em LID) */
    phone?: string;
    /** Profile picture URL (high resolution preferred) */
    picture?: string;
    /** Business account indicator */
    isBusinessAccount?: boolean;
}
/**
 * Group Information
 * Structured group data when message is from a group
 *
 * @since v2.2.0 - Group conversation support
 */
export interface MessageGroup {
    /** Group JID - OBRIGATÓRIO */
    id: string;
    /** Group name/subject */
    name?: string;
    /** Group profile picture URL */
    picture?: string;
    /** Group description */
    description?: string;
    /** Group owner JID */
    owner?: string;
    /** Total participants count */
    participantCount?: number;
}
/**
 * Gateway Webhook Payload structure
 * This is the payload format that the Gateway sends to the Backend
 */
export interface GatewayWebhookPayload {
    instanceKey: string;
    event: 'message' | 'status' | 'connect' | 'disconnect' | 'error' | 'account.updated' | 'account.restricted';
    data: GatewayEventData;
}
/**
 * Gateway Event Data
 * Data structure for different types of events from Gateway
 *
 * @since v2.2.0 - Updated with structured sender and group support
 */
/**
 * Trava de alcance ("reachout timelock") aplicada pelo WhatsApp À CONTA.
 *
 * Enquanto vale, abrir conversa NOVA a partir de um aparelho VINCULADO é
 * recusado com o erro 463; responder conversa existente continua funcionando, e
 * o celular do dono não é afetado — por isso o defeito parece do sistema.
 *
 * Publicado pelos dois motores com o mesmo formato: worker Go (whatsmeow,
 * evento NotifyAccountReachoutTimelock) e worker Baileys (nó cru
 * `CB:notification,type:mex`).
 */
export interface GatewayAccountRestriction {
    /** `enforcement_type` do servidor, verbatim — traduzir esconderia tipo novo. */
    type: string;
    /** `false` é a LIBERAÇÃO: o mesmo aviso informa quando a trava sai. */
    active: boolean;
    /** ISO 8601 UTC; AUSENTE quando o servidor não declarou prazo. */
    endsAt?: string;
}
export interface GatewayEventData {
    /** Presente em `account.restricted`. */
    restriction?: GatewayAccountRestriction;
    messageId?: string;
    providerMessageId?: string;
    to?: string;
    fromMe?: boolean;
    message?: string;
    messageType?: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker' | 'location' | 'contact' | 'reaction' | 'edit' | 'delete' | 'poll' | 'poll-vote' | 'buttons' | 'list' | 'unknown';
    from?: MessageSender;
    group?: MessageGroup;
    media?: MediaData;
    location?: {
        latitude: number;
        longitude: number;
        name?: string;
        address?: string;
        url?: string;
        comment?: string;
    };
    contact?: {
        displayName: string;
        vcard: string;
    };
    reaction?: {
        emoji: string;
        targetMessageId: string;
        targetRemoteJid?: string;
    };
    edit?: {
        targetMessageId: string;
        newText: string;
    };
    delete?: {
        targetMessageId: string;
    };
    poll?: {
        name: string;
        options: string[];
        selectableCount?: number;
    };
    pollVote?: {
        pollMessageId: string;
        selectedOptionHashes: string[];
    };
    isForwarded?: boolean;
    quoted?: {
        messageId: string;
        participant: string;
        content: string;
    };
    quotedMessageId?: string;
    status?: 'sent' | 'delivered' | 'read' | 'failed';
    phoneNumber?: string;
    clientId?: string;
    accountInfo?: {
        identifier: string;
        pushName?: string;
        verifiedName?: string;
        businessName?: string;
        platform?: string;
        profilePictureUrl?: string;
        hasProfilePicture?: boolean;
        coverPhotoUrl?: string;
        status?: string;
        description?: string;
        email?: string;
        address?: string;
        websites?: string[];
        category?: string;
        categories?: string[];
        businessHours?: Array<{
            dayOfWeek: string;
            mode: string;
            openTime?: number;
            closeTime?: number;
        }>;
        timezone?: string;
    };
    error?: string;
    errorCode?: string;
    timestamp: string;
    metadata?: {
        originalPayload?: Record<string, unknown>;
        [key: string]: unknown;
    };
}
/**
 * Gateway Send Message Request
 * Structure for sending messages via Gateway API
 */
export interface GatewaySendMessageRequest {
    instanceKey: string;
    instanceToken: string;
    to: string;
    message: string;
    mediaUrl?: string;
    messageId?: string;
}
/**
 * Gateway Send Message Response
 * Response structure from Gateway when sending messages
 */
export interface GatewaySendMessageResponse {
    success: boolean;
    messageId?: string;
    instanceKey: string;
    error?: string;
}
/**
 * Gateway Instance Status
 * Status information about a Gateway instance
 */
export interface GatewayInstanceStatus {
    instanceKey: string;
    status: 'connected' | 'disconnected' | 'connecting' | 'error';
    phoneNumber?: string;
    clientId?: string;
    lastSeen?: string;
    uptime?: number;
    memory?: number;
    cpu?: number;
    pm2Status?: string;
}
/**
 * Gateway Connection Response
 * Response when connecting to Gateway instance
 */
export interface GatewayConnectionResponse {
    success: boolean;
    qrCode?: string;
    expires?: number;
    fresh?: boolean;
    instanceKey: string;
    error?: string;
}
/**
 * Gateway Provider Error Types
 * Specific error types for Gateway provider
 */
export declare enum GatewayErrorType {
    INSTANCE_NOT_FOUND = "INSTANCE_NOT_FOUND",
    INSTANCE_NOT_CONNECTED = "INSTANCE_NOT_CONNECTED",
    INVALID_TOKEN = "INVALID_TOKEN",
    GATEWAY_UNREACHABLE = "GATEWAY_UNREACHABLE",
    WEBHOOK_FAILED = "WEBHOOK_FAILED",
    MESSAGE_SEND_FAILED = "MESSAGE_SEND_FAILED",
    TIMEOUT = "TIMEOUT"
}
/**
 * Gateway Provider Configuration Validation
 * Helper interface for validating Gateway configurations
 */
export interface GatewayConfigValidation {
    gatewayUrl: {
        isValid: boolean;
        isReachable?: boolean;
        responseTime?: number;
    };
    instanceKey: {
        isValid: boolean;
        exists?: boolean;
    };
    instanceToken: {
        isValid: boolean;
        isAuthenticated?: boolean;
    };
    webhookPath: {
        isValid: boolean;
        isRegistered?: boolean;
    };
}

import { ObjectId } from 'mongodb';
export interface SmtpConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
    from: string;
}
export interface SendGridConfig {
    apiKey: string;
    fromEmail: string;
    fromName?: string;
}
export interface WhatsAppConfig {
    whatsappBusinessAccountId: string;
    phoneNumberId: string;
    webhookToken?: string;
}
export interface FacebookMessengerConfig {
    pageId: string;
    appSecret: string;
    webhookToken?: string;
}
export interface TelegramConfig {
    botToken: string;
    webhookUrl?: string;
}
export interface TwilioSmsConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}
export interface WebhookConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH';
    headers?: Record<string, string>;
    authentication?: {
        type: 'bearer' | 'basic' | 'api_key';
        token: string;
    };
}
export interface InstagramConfig {
    instagramBusinessAccountId: string;
    pageId: string;
    webhookToken?: string;
}
export interface LinkedInConfig {
    organizationId: string;
    clientId: string;
    clientSecret: string;
}
export interface TikTokConfig {
    businessAccountId: string;
    appId: string;
    appSecret: string;
}
export interface GmailConfig {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    fromEmail: string;
}
export interface GatewayConfig {
    webhookPath?: string;
    timeout?: number;
    engine?: 'node' | 'go';
}
export interface GoogleCalendarConfig {
    clientId: string;
    clientSecret: string;
    redirectUri?: string;
}
export interface FirebaseConfig {
    projectId: string;
    privateKey: string;
    clientEmail: string;
    databaseUrl?: string;
}
export interface OneSignalConfig {
    appId: string;
    apiKey: string;
    userAuthKey?: string;
}
export interface ElevenLabsConfig {
    apiKey: string;
    defaultVoiceId?: string;
    modelId?: string;
}
export interface JetimobConfig {
    apiKey: string;
    syncInterval?: number;
}
export interface DwvConfig {
    token: string;
    syncInterval?: number;
}
export interface MetaConfig {
    appId: string;
    appSecret: string;
    configId?: string;
    graphApiVersion: string;
    systemUserAccessToken?: string;
}
export interface ResendConfig {
    apiKey: string;
    defaultRegion?: string;
    webhookSecret?: string;
    webhookId?: string;
}
export type ProviderConfig = SmtpConfig | SendGridConfig | WhatsAppConfig | FacebookMessengerConfig | TelegramConfig | TwilioSmsConfig | WebhookConfig | InstagramConfig | LinkedInConfig | TikTokConfig | GmailConfig | GatewayConfig | GoogleCalendarConfig | FirebaseConfig | OneSignalConfig | ElevenLabsConfig | JetimobConfig | DwvConfig | MetaConfig | ResendConfig;
export interface ProviderCredentials {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    apiKey?: string;
    apiSecret?: string;
    username?: string;
    password?: string;
    customAuth?: Record<string, any>;
}
/**
 * Rate limit source - where the limit came from
 */
export type RateLimitSource = 'default' | 'webhook' | 'manual' | 'api';
/**
 * WhatsApp Business API messaging tiers
 */
export type WhatsAppTier = 'tier_0' | 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
/**
 * WhatsApp quality rating levels
 */
export type QualityRating = 'green' | 'yellow' | 'red';
/**
 * Provider rate limits configuration
 * Used to control message sending rates per provider/integration
 */
export interface ProviderRateLimits {
    messagesPerSecond: number;
    messagesPerMinute: number;
    messagesPerHour: number;
    messagesPerDay: number;
    tier?: WhatsAppTier;
    qualityRating?: QualityRating;
    source: RateLimitSource;
    lastUpdated?: Date;
    errorCount?: number;
    lastErrorAt?: Date;
}
/**
 * Rate limit usage tracking (stored in Redis)
 */
export interface RateLimitUsage {
    integrationId: string;
    sentToday: number;
    sentThisHour: number;
    sentThisMinute: number;
    dailyLimit: number;
    remainingToday: number;
    resetAt: Date;
}
/**
 * Rate limit check result
 */
export interface RateLimitCheckResult {
    allowed: boolean;
    waitMs?: number;
    reason?: 'daily_limit_reached' | 'hourly_limit_reached' | 'minute_limit_reached' | 'second_limit_reached' | 'quality_rating_flagged';
    currentUsage?: RateLimitUsage;
}
export declare enum ProviderId {
    EMAIL_SMTP = "email-smtp",
    EMAIL_SENDGRID = "email-sendgrid",
    EMAIL_SES = "email-ses",
    EMAIL_RESEND = "email-resend",
    GMAIL_API = "gmail-api",
    WHATSAPP_BUSINESS = "whatsapp-business",
    FACEBOOK_MESSENGER = "facebook-messenger",
    TELEGRAM_BOT = "telegram-bot",
    SMS_TWILIO = "sms-twilio",
    PUSH_FIREBASE = "push-firebase",
    PUSH_ONESIGNAL = "push-onesignal",
    GATEWAY_WHATSAPP = "gateway-whatsapp",
    INSTAGRAM_MESSAGING = "instagram-messaging",
    LINKEDIN_MESSAGING = "linkedin-messaging",
    TIKTOK_MESSAGING = "tiktok-messaging",
    TIKTOK_BUSINESS = "tiktok-business",
    PAYMENT_ASAAS = "payment-asaas",
    PAYMENT_STRIPE = "payment-stripe",
    PAYMENT_PAYPAL = "payment-paypal",
    PAYMENT_MERCADOPAGO = "payment-mercadopago",
    GOOGLE_CALENDAR = "google-calendar",
    OUTLOOK_CALENDAR = "outlook-calendar",
    ICLOUD_CALENDAR = "icloud-calendar",
    WEBSITE_CHAT = "website-chat",
    WEBSITE_WIDGET = "website-widget",
    API_WEBHOOK = "api-webhook",
    AI_OPENAI = "ai-openai",
    AI_ANTHROPIC = "ai-anthropic",
    AI_XAI = "ai-xai",
    AI_GOOGLE = "ai-google",
    AI_MISTRAL = "ai-mistral",
    AI_DEEPSEEK = "ai-deepseek",
    AI_ELEVENLABS = "ai-elevenlabs",
    DATABASE_JETIMOB = "database-jetimob",
    DATABASE_DWV = "database-dwv",
    DATABASE_KENLO = "database-kenlo",
    VECTOR_PINECONE = "vector-pinecone",
    META = "meta"
}
export declare enum ProviderCapability {
    SEND_EMAIL = "send_email",
    RECEIVE_EMAIL = "receive_email",
    SEND_MESSAGE = "send_message",
    RECEIVE_MESSAGE = "receive_message",
    SEND_MEDIA = "send_media",
    RECEIVE_MEDIA = "receive_media",
    SEND_LOCATION = "send_location",
    SEND_CONTACT = "send_contact",
    SEND_REACTION = "send_reaction",
    SEND_ATTACHMENT = "send_attachment",
    RECEIVE_ATTACHMENT = "receive_attachment",
    SEND_SMS = "send_sms",
    SEND_PUSH = "send_push",
    CREATE_POST = "create_post",
    CREATE_STORY = "create_story",
    CREATE_CAMPAIGN = "create_campaign",
    CREATE_EVENT = "create_event",
    CREATE_TEMPLATE = "create_template",
    TRACK_DELIVERY = "track_delivery",
    TRACK_OPENS = "track_opens",
    TRACK_CLICKS = "track_clicks",
    SCHEDULE_MESSAGE = "schedule_message",
    CALENDAR_SYNC = "calendar_sync",
    CALENDAR_READ = "calendar_read",
    CALENDAR_WRITE = "calendar_write",
    SYNC_DATA = "sync_data",// ✅ Provider supports data synchronization
    PROCESS_PAYMENT = "process_payment",
    PROCESS_SUBSCRIPTION = "process_subscription",
    TOKENIZE_CARD = "tokenize_card",
    REFUND_PAYMENT = "refund_payment",
    CANCEL_SUBSCRIPTION = "cancel_subscription",
    CREATE_CONTACT = "create_contact",
    UPDATE_CONTACT = "update_contact",
    CREATE_LIST = "create_list",
    SEND_BULK = "send_bulk",
    BULK_SEND = "bulk_send",
    CREATE_WEBHOOK = "create_webhook",
    RECEIVE_WEBHOOK = "receive_webhook",
    VERIFY_WEBHOOK = "verify_webhook",
    SEND_WEBHOOK = "send_webhook",
    CREATE_FORM = "create_form",
    SUBMIT_FORM = "submit_form",
    CREATE_SURVEY = "create_survey",
    RECEIVE_FORM = "receive_form",
    CREATE_WIDGET = "create_widget",
    TRACK_VISITOR = "track_visitor",
    LIVE_CHAT = "live_chat",
    REST_API = "rest_api",
    GRAPHQL = "graphql",
    GET_INSIGHTS = "get_insights",
    TRACK_OPEN = "track_open",
    CREATE_BOT = "create_bot",
    MANAGE_PAGE = "manage_page",
    MANAGE_ACCOUNT = "manage_account",
    GENERATE_EMBEDDING = "generate_embedding",
    VECTOR_STORAGE = "vector_storage",
    AI_TEXT_GENERATION = "ai_text_generation",// LLM text generation (GPT, Claude, etc.)
    AI_CHAT_COMPLETION = "ai_chat_completion",// Chat completion with conversation history
    TEXT_TO_SPEECH = "text_to_speech",// Convert text to audio (TTS)
    SPEECH_TO_TEXT = "speech_to_text",// Convert audio to text (STT/Whisper)
    TEMPLATE_MANAGEMENT = "template_management",// Submit, approve, manage templates
    FETCH_PROPERTIES = "fetch_properties",// Fetch properties from external system
    SYNC_PROPERTIES = "sync_properties",// Sync properties bidirectionally
    CREATE_PROPERTY = "create_property",// Create property in external system
    UPDATE_PROPERTY = "update_property",// Update property in external system
    DELETE_PROPERTY = "delete_property",// Delete property from external system
    SOCIAL_LOGIN = "social_login",// OAuth social login (Facebook, Instagram)
    WHATSAPP_EMBEDDED_SIGNUP = "whatsapp_embedded_signup",// WhatsApp Business Embedded Signup flow
    VOICE_CLONING = "voice_cloning",// Clone custom voices (ElevenLabs, etc.)
    BATCH_SEND = "batch_send",// Send emails/messages in batch
    DOMAIN_MANAGEMENT = "domain_management"
}
export interface BaseIntegrationRequest {
    name: string;
    description?: string;
}
export interface CreateSmtpIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.EMAIL_SMTP;
    config: SmtpConfig;
    credentials?: ProviderCredentials;
}
export interface CreateSendGridIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.EMAIL_SENDGRID;
    config: SendGridConfig;
    credentials?: ProviderCredentials;
}
export interface CreateWhatsAppIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.WHATSAPP_BUSINESS;
    config: WhatsAppConfig;
    credentials: ProviderCredentials;
}
export interface CreateFacebookMessengerIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.FACEBOOK_MESSENGER;
    config: FacebookMessengerConfig;
    credentials: ProviderCredentials;
}
export interface CreateTelegramIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.TELEGRAM_BOT;
    config: TelegramConfig;
    credentials?: ProviderCredentials;
}
export interface CreateWebhookIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.API_WEBHOOK;
    config: WebhookConfig;
    credentials?: ProviderCredentials;
}
export interface CreateGatewayIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.GATEWAY_WHATSAPP;
    config: GatewayConfig;
    credentials?: ProviderCredentials;
}
export interface CreateGoogleCalendarIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.GOOGLE_CALENDAR;
    config: GoogleCalendarConfig;
    credentials?: ProviderCredentials;
}
export interface CreateMetaIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.META;
    config: MetaConfig;
    credentials?: ProviderCredentials;
}
export interface CreateResendIntegrationRequest extends BaseIntegrationRequest {
    providerId: ProviderId.EMAIL_RESEND;
    config: ResendConfig;
    credentials?: ProviderCredentials;
}
export type CreateProviderIntegrationRequest = CreateSmtpIntegrationRequest | CreateSendGridIntegrationRequest | CreateWhatsAppIntegrationRequest | CreateFacebookMessengerIntegrationRequest | CreateTelegramIntegrationRequest | CreateWebhookIntegrationRequest | CreateGatewayIntegrationRequest | CreateGoogleCalendarIntegrationRequest | CreateMetaIntegrationRequest | CreateResendIntegrationRequest;
export interface Provider {
    _id?: ObjectId;
    name: string;
    type: string;
    category: 'messaging' | 'payment' | 'email' | 'calendar' | 'storage' | 'social';
    capabilities: ProviderCapability[];
    syncInterval?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface ProviderResponse extends Omit<Provider, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    id: string;
    syncInterval?: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface GenericProviderConfig {
    [key: string]: any;
}
export interface VectorMetadata {
    appId: string;
    companyId: string;
    resourceType: 'conversation-message-chunk' | 'database-document';
    resourceId: string;
}
export interface VectorSearchResult {
    id: string;
    score: number;
    metadata: VectorMetadata;
}
export interface VectorFilter {
    appId: string;
    companyId: string;
    resourceType?: 'conversation-message-chunk' | 'database-document';
}

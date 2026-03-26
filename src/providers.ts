import { ObjectId } from 'mongodb';

// ============================================================================
// PROVIDER-SPECIFIC CONFIGURATIONS (Shared across app & company integrations)
// ============================================================================

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
  accountSid: string;          // ✅ Twilio Account SID
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
  // ✅ CONFIGURAÇÕES OPCIONAIS (gatewayUrl vem do .env, credenciais geradas pelo backend)
  webhookPath?: string;         // Path customizado para webhook
  timeout?: number;             // Timeout para requests (padrão: 10000ms)
  engine?: 'node' | 'go';      // Engine do worker WhatsApp (padrão: 'node')
}

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;         // OAuth redirect URI (auto-generated if not provided)
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
  defaultVoiceId?: string;  // Ex: 'pNInz6obpgDQGcFmaJgB' (Adam voice)
  modelId?: string;         // Ex: 'eleven_multilingual_v2'
}

export interface JetimobConfig {
  apiKey: string;            // Jetimob API Key
  syncInterval?: number;     // Intervalo de sincronização em minutos (default: 60)
}

export interface DwvConfig {
  token: string;             // DWV API Token (header authentication)
  syncInterval?: number;     // Intervalo de sincronização em minutos (default: 60)
}

export interface MetaConfig {
  appId: string;             // Meta App ID
  appSecret: string;         // Meta App Secret
  configId?: string;         // WhatsApp Embedded Signup Config ID (optional, for WABA signup)
  graphApiVersion: string;   // Graph API version (e.g., 'v21.0')
  systemUserAccessToken?: string; // SUAT - fallback token when code exchange token has insufficient scopes
}

export interface ResendConfig {
  apiKey: string;              // Resend API Key
  defaultRegion?: string;      // Default region for domains (e.g., 'us-east-1')
  webhookSecret?: string;      // Svix webhook signing secret (auto-set on integration creation)
  webhookId?: string;          // Resend webhook ID (auto-set on integration creation)
}

// ============================================================================
// UNION TYPE FOR ALL PROVIDER CONFIGS
// ============================================================================

export type ProviderConfig =
  | SmtpConfig
  | SendGridConfig
  | WhatsAppConfig
  | FacebookMessengerConfig
  | TelegramConfig
  | TwilioSmsConfig
  | WebhookConfig
  | InstagramConfig
  | LinkedInConfig
  | TikTokConfig
  | GmailConfig
  | GatewayConfig
  | GoogleCalendarConfig
  | FirebaseConfig
  | OneSignalConfig
  | ElevenLabsConfig
  | JetimobConfig
  | DwvConfig
  | MetaConfig
  | ResendConfig;

// ============================================================================
// PROVIDER CREDENTIALS (OAuth tokens, etc.)
// ============================================================================

export interface ProviderCredentials {
  // Common OAuth fields
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;

  // API Key authentication
  apiKey?: string;
  apiSecret?: string;

  // Basic authentication
  username?: string;
  password?: string;

  // Custom authentication
  customAuth?: Record<string, any>;
}

// ============================================================================
// RATE LIMITING TYPES
// ============================================================================

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
  // Throughput limits (messages per period)
  messagesPerSecond: number;        // Ex: 80 for WhatsApp Business
  messagesPerMinute: number;        // Ex: 4800
  messagesPerHour: number;          // Ex: 288000
  messagesPerDay: number;           // Ex: 1000 for tier_1

  // WhatsApp-specific fields
  tier?: WhatsAppTier;              // WhatsApp messaging tier
  qualityRating?: QualityRating;    // Quality rating (green, yellow, red)

  // Metadata
  source: RateLimitSource;          // Where these limits came from
  lastUpdated?: Date;               // When limits were last updated

  // Error handling
  errorCount?: number;              // Count of rate limit errors (130429)
  lastErrorAt?: Date;               // Last rate limit error timestamp
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
  resetAt: Date;                    // When daily counter resets
}

/**
 * Rate limit check result
 */
export interface RateLimitCheckResult {
  allowed: boolean;
  waitMs?: number;                  // Milliseconds to wait before retry
  reason?: 'daily_limit_reached' | 'hourly_limit_reached' | 'minute_limit_reached' | 'second_limit_reached' | 'quality_rating_flagged';
  currentUsage?: RateLimitUsage;
}

// ============================================================================
// PROVIDER ENUM (Centralized)
// ============================================================================

export enum ProviderId {
  // Email Providers
  EMAIL_SMTP = 'email-smtp',
  EMAIL_SENDGRID = 'email-sendgrid',
  EMAIL_SES = 'email-ses',
  EMAIL_RESEND = 'email-resend',
  GMAIL_API = 'gmail-api',

  // Messaging Providers
  WHATSAPP_BUSINESS = 'whatsapp-business',
  FACEBOOK_MESSENGER = 'facebook-messenger',
  TELEGRAM_BOT = 'telegram-bot',
  SMS_TWILIO = 'sms-twilio',
  PUSH_FIREBASE = 'push-firebase',
  PUSH_ONESIGNAL = 'push-onesignal',
  GATEWAY_WHATSAPP = 'gateway-whatsapp',

  // Social Media Providers
  INSTAGRAM_MESSAGING = 'instagram-messaging',
  LINKEDIN_MESSAGING = 'linkedin-messaging',
  TIKTOK_MESSAGING = 'tiktok-messaging',
  TIKTOK_BUSINESS = 'tiktok-business',

  // Payment Providers
  PAYMENT_ASAAS = 'payment-asaas',
  PAYMENT_STRIPE = 'payment-stripe',
  PAYMENT_PAYPAL = 'payment-paypal',
  PAYMENT_MERCADOPAGO = 'payment-mercadopago',

  // Calendar Providers
  GOOGLE_CALENDAR = 'google-calendar',
  OUTLOOK_CALENDAR = 'outlook-calendar',
  ICLOUD_CALENDAR = 'icloud-calendar',

  // Web/API Providers
  WEBSITE_CHAT = 'website-chat',
  WEBSITE_WIDGET = 'website-widget',
  API_WEBHOOK = 'api-webhook',

  // AI Providers
  AI_OPENAI = 'ai-openai',
  AI_ANTHROPIC = 'ai-anthropic',
  AI_XAI = 'ai-xai',
  AI_GOOGLE = 'ai-google',
  AI_MISTRAL = 'ai-mistral',
  AI_DEEPSEEK = 'ai-deepseek',
  AI_ELEVENLABS = 'ai-elevenlabs',

  // Database Providers (Properties, Real Estate, etc.)
  DATABASE_JETIMOB = 'database-jetimob',
  DATABASE_DWV = 'database-dwv',
  DATABASE_KENLO = 'database-kenlo',

  // Meta Platform (Unified Meta services)
  META = 'meta'
}

// ============================================================================
// PROVIDER CAPABILITIES (Centralized)
// ============================================================================

export enum ProviderCapability {
  // Email capabilities
  SEND_EMAIL = 'send_email',
  RECEIVE_EMAIL = 'receive_email',

  // Messaging capabilities
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  SEND_MEDIA = 'send_media',
  RECEIVE_MEDIA = 'receive_media',
  SEND_LOCATION = 'send_location',
  SEND_CONTACT = 'send_contact',
  SEND_REACTION = 'send_reaction',
  SEND_ATTACHMENT = 'send_attachment',
  RECEIVE_ATTACHMENT = 'receive_attachment',

  // Notification capabilities
  SEND_SMS = 'send_sms',
  SEND_PUSH = 'send_push',

  // Social media capabilities
  CREATE_POST = 'create_post',
  CREATE_STORY = 'create_story',
  CREATE_CAMPAIGN = 'create_campaign',

  // Advanced capabilities
  CREATE_EVENT = 'create_event',
  CREATE_TEMPLATE = 'create_template',
  TRACK_DELIVERY = 'track_delivery',
  TRACK_OPENS = 'track_opens',
  TRACK_CLICKS = 'track_clicks',
  SCHEDULE_MESSAGE = 'schedule_message',

  // Calendar capabilities
  CALENDAR_SYNC = 'calendar_sync',
  CALENDAR_READ = 'calendar_read',
  CALENDAR_WRITE = 'calendar_write',

  // Sync capabilities
  SYNC_DATA = 'sync_data',          // ✅ Provider supports data synchronization

  // Payment capabilities
  PROCESS_PAYMENT = 'process_payment',
  PROCESS_SUBSCRIPTION = 'process_subscription',
  TOKENIZE_CARD = 'tokenize_card',
  REFUND_PAYMENT = 'refund_payment',
  CANCEL_SUBSCRIPTION = 'cancel_subscription',

  // CRM capabilities
  CREATE_CONTACT = 'create_contact',
  UPDATE_CONTACT = 'update_contact',
  CREATE_LIST = 'create_list',
  SEND_BULK = 'send_bulk',
  BULK_SEND = 'bulk_send',

  // Webhook capabilities
  CREATE_WEBHOOK = 'create_webhook',
  RECEIVE_WEBHOOK = 'receive_webhook',
  VERIFY_WEBHOOK = 'verify_webhook',
  SEND_WEBHOOK = 'send_webhook',

  // Form capabilities
  CREATE_FORM = 'create_form',
  SUBMIT_FORM = 'submit_form',
  CREATE_SURVEY = 'create_survey',
  RECEIVE_FORM = 'receive_form',

  // Widget capabilities
  CREATE_WIDGET = 'create_widget',
  TRACK_VISITOR = 'track_visitor',
  LIVE_CHAT = 'live_chat',

  // API capabilities
  REST_API = 'rest_api',
  GRAPHQL = 'graphql',

  // Analytics capabilities
  GET_INSIGHTS = 'get_insights',
  TRACK_OPEN = 'track_open',

  // Bot capabilities
  CREATE_BOT = 'create_bot',

  // Page management
  MANAGE_PAGE = 'manage_page',

  // Account management
  MANAGE_ACCOUNT = 'manage_account',

  // AI Capabilities
  GENERATE_EMBEDDING = 'generate_embedding',
  AI_TEXT_GENERATION = 'ai_text_generation',  // LLM text generation (GPT, Claude, etc.)
  AI_CHAT_COMPLETION = 'ai_chat_completion',  // Chat completion with conversation history
  TEXT_TO_SPEECH = 'text_to_speech',          // Convert text to audio (TTS)
  SPEECH_TO_TEXT = 'speech_to_text',          // Convert audio to text (STT/Whisper)

  // Template Management
  TEMPLATE_MANAGEMENT = 'template_management',  // Submit, approve, manage templates

  // Database Capabilities (Properties, Real Estate, etc.)
  FETCH_PROPERTIES = 'fetch_properties',        // Fetch properties from external system
  SYNC_PROPERTIES = 'sync_properties',          // Sync properties bidirectionally
  CREATE_PROPERTY = 'create_property',          // Create property in external system
  UPDATE_PROPERTY = 'update_property',          // Update property in external system
  DELETE_PROPERTY = 'delete_property',          // Delete property from external system

  // Meta Platform Capabilities
  SOCIAL_LOGIN = 'social_login',                        // OAuth social login (Facebook, Instagram)
  WHATSAPP_EMBEDDED_SIGNUP = 'whatsapp_embedded_signup', // WhatsApp Business Embedded Signup flow

  // Voice Cloning capabilities
  VOICE_CLONING = 'voice_cloning',               // Clone custom voices (ElevenLabs, etc.)

  // Batch & Domain Management capabilities
  BATCH_SEND = 'batch_send',                     // Send emails/messages in batch
  DOMAIN_MANAGEMENT = 'domain_management'        // Manage email domains (DNS, verification)
}

// ============================================================================
// TYPED INTEGRATION REQUESTS (Generic - usable by both app & company)
// ============================================================================

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

// ============================================================================
// UNION TYPE FOR TYPED INTEGRATION REQUESTS
// ============================================================================

export type CreateProviderIntegrationRequest =
  | CreateSmtpIntegrationRequest
  | CreateSendGridIntegrationRequest
  | CreateWhatsAppIntegrationRequest
  | CreateFacebookMessengerIntegrationRequest
  | CreateTelegramIntegrationRequest
  | CreateWebhookIntegrationRequest
  | CreateGatewayIntegrationRequest
  | CreateGoogleCalendarIntegrationRequest
  | CreateMetaIntegrationRequest
  | CreateResendIntegrationRequest;

// ============================================================================
// PROVIDER ENTITY (Database schema)
// ============================================================================

export interface Provider {
  _id?: ObjectId;
  name: string;                     // Ex: "Google Calendar", "Outlook Calendar"
  type: string;                     // Ex: "google_calendar", "outlook_calendar"
  category: 'messaging' | 'payment' | 'email' | 'calendar' | 'storage' | 'social';
  capabilities: ProviderCapability[];
  syncInterval?: number;            // ✅ Sync interval in minutes (for SYNC_DATA capability)
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

// ============================================================================
// LEGACY GENERIC CONFIG (For non-typed providers)
// ============================================================================

export interface GenericProviderConfig {
  [key: string]: any;
}

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
  // Coexistence mode (NUNCA add to Channel — provider-specific Meta concept)
  /** Intent — escolha do usuário no onboarding via Embedded Signup. */
  mode?: 'standalone' | 'coexistence';
  /** Truth — mirror do GET /{wabaId}?fields=account_mode (Graph API). Source of truth pra runtime. */
  accountMode?: 'STANDALONE' | 'COEXISTENCE';
  /** ISO timestamp da última sincronização de accountMode com Meta. */
  accountModeUpdatedAt?: string;
  // Setup automático pós Embedded Signup (2026-07-05) — status persistido, nunca silencioso
  /** POST /{wabaId}/subscribed_apps executado com sucesso (recepção de webhooks habilitada). */
  webhookSubscribed?: boolean;
  /** ISO timestamp da última assinatura de webhook bem-sucedida. */
  webhookSubscribedAt?: string;
  /** POST /{phoneNumberId}/register executado com sucesso (número apto a enviar via Cloud API). Coexistência pula (número já registrado pelo Business App). */
  phoneRegistered?: boolean;
  /** ISO timestamp do registro do número. */
  phoneRegisteredAt?: string;
  /** Última falha do setup automático (webhook subscribe ou register). Limpo quando o passo sucede. */
  setupError?: string;
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
  configId?: string;         // WhatsApp Embedded Signup Config ID (mesmo config serve para standalone e coexistência — só muda o featureType em runtime, ver Meta docs)
  /**
   * Habilita a oferta do modo Coexistência para os tenants. Quando true, o frontend
   * renderiza o picker (standalone vs coexistência) no WhatsAppBusinessForm. Quando
   * false (ou undefined), apenas standalone é ofertado.
   *
   * Não confundir com um configId separado — Meta usa o mesmo Login Config; a
   * diferença vem do `featureType` passado em runtime (`whatsapp_business_app_onboarding`
   * vs `whatsapp_embedded_signup`).
   */
  coexistenceEnabled?: boolean;
  graphApiVersion: string;   // Graph API version (e.g., 'v21.0')
  systemUserAccessToken?: string; // SUAT - fallback token when code exchange token has insufficient scopes
}

export interface ResendConfig {
  apiKey: string;              // Resend API Key
  defaultRegion?: string;      // Default region for domains (e.g., 'us-east-1')
  webhookSecret?: string;      // Svix webhook signing secret (auto-set on integration creation)
  webhookId?: string;          // Resend webhook ID (auto-set on integration creation)
}

export interface CohereIntegrationConfig {
  apiKey: string;
  /** Cohere Rerank model. Default: 'rerank-v3.5' */
  model?: string;
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
  customAuth?: Record<string, unknown>;
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
  reason?: 'daily_limit_reached' | 'hourly_limit_reached' | 'minute_limit_reached' | 'second_limit_reached' | 'quality_rating_flagged' | 'minimum_delay_between_messages';
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
  AI_COHERE = 'ai-cohere',

  // Database Providers (Properties, Real Estate, etc.)
  DATABASE_JETIMOB = 'database-jetimob',
  DATABASE_DWV = 'database-dwv',
  DATABASE_KENLO = 'database-kenlo',

  // Vector Storage Providers
  VECTOR_PINECONE = 'vector-pinecone',

  // Meta Platform (Unified Meta services)
  META = 'meta'
}

// ============================================================================
// PROVIDER CATEGORY MAPPING (Static, centralized)
// ============================================================================

export type ProviderCategory = 'email' | 'messaging' | 'social' | 'payment' | 'calendar' | 'web' | 'ai' | 'database' | 'vector' | 'meta';

export const PROVIDER_CATEGORY: Record<ProviderId, ProviderCategory> = {
  // Email
  [ProviderId.EMAIL_SMTP]: 'email',
  [ProviderId.EMAIL_SENDGRID]: 'email',
  [ProviderId.EMAIL_SES]: 'email',
  [ProviderId.EMAIL_RESEND]: 'email',
  [ProviderId.GMAIL_API]: 'email',

  // Messaging
  [ProviderId.WHATSAPP_BUSINESS]: 'messaging',
  [ProviderId.FACEBOOK_MESSENGER]: 'messaging',
  [ProviderId.TELEGRAM_BOT]: 'messaging',
  [ProviderId.SMS_TWILIO]: 'messaging',
  [ProviderId.PUSH_FIREBASE]: 'messaging',
  [ProviderId.PUSH_ONESIGNAL]: 'messaging',
  [ProviderId.GATEWAY_WHATSAPP]: 'messaging',

  // Social
  [ProviderId.INSTAGRAM_MESSAGING]: 'social',
  [ProviderId.LINKEDIN_MESSAGING]: 'social',
  [ProviderId.TIKTOK_MESSAGING]: 'social',
  [ProviderId.TIKTOK_BUSINESS]: 'social',

  // Payment
  [ProviderId.PAYMENT_ASAAS]: 'payment',
  [ProviderId.PAYMENT_STRIPE]: 'payment',
  [ProviderId.PAYMENT_PAYPAL]: 'payment',
  [ProviderId.PAYMENT_MERCADOPAGO]: 'payment',

  // Calendar
  [ProviderId.GOOGLE_CALENDAR]: 'calendar',
  [ProviderId.OUTLOOK_CALENDAR]: 'calendar',
  [ProviderId.ICLOUD_CALENDAR]: 'calendar',

  // Web/API
  [ProviderId.WEBSITE_CHAT]: 'web',
  [ProviderId.WEBSITE_WIDGET]: 'web',
  [ProviderId.API_WEBHOOK]: 'web',

  // AI
  [ProviderId.AI_OPENAI]: 'ai',
  [ProviderId.AI_ANTHROPIC]: 'ai',
  [ProviderId.AI_XAI]: 'ai',
  [ProviderId.AI_GOOGLE]: 'ai',
  [ProviderId.AI_MISTRAL]: 'ai',
  [ProviderId.AI_DEEPSEEK]: 'ai',
  [ProviderId.AI_ELEVENLABS]: 'ai',
  [ProviderId.AI_COHERE]: 'ai',

  // Database
  [ProviderId.DATABASE_JETIMOB]: 'database',
  [ProviderId.DATABASE_DWV]: 'database',
  [ProviderId.DATABASE_KENLO]: 'database',

  // Vector
  [ProviderId.VECTOR_PINECONE]: 'vector',

  // Meta
  [ProviderId.META]: 'meta',
};

/** Check if a providerId belongs to a given category */
export const isProviderCategory = (providerId: string | null | undefined, category: ProviderCategory): boolean => {
  if (!providerId) return false;
  return PROVIDER_CATEGORY[providerId as ProviderId] === category;
};

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
  RERANK = 'rerank',
  VECTOR_STORAGE = 'vector_storage',
  AI_TEXT_GENERATION = 'ai_text_generation',  // LLM text generation (GPT, Claude, etc.)
  AI_CHAT_COMPLETION = 'ai_chat_completion',  // Chat completion with conversation history
  // Internal subagents (services da plataforma TROIA que usam LLM, agrupados por afinidade funcional).
  // Cada tenant marca essas capabilities na integration que quer usar para cada grupo.
  AI_INTERNAL_JUDGE = 'ai_internal_judge',           // LlmJudgeService (10 evaluators), judge-llm tool, quality-test, ab-test
  AI_INTERNAL_PROCESSING = 'ai_internal_processing', // narration-cleaner, summarizer, lead-processor, wizard draft, workflow modifier
  AI_INTERNAL_ANALYTICS = 'ai_internal_analytics',   // gap classifier/resolution, insights, topic-tagger, prompt coach/migration/rewriter, training
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
  [key: string]: unknown;
}

// ============================================================================
// VECTOR STORAGE TYPES
// ============================================================================

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

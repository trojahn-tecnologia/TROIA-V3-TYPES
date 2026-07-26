"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderCapability = exports.isProviderCategory = exports.PROVIDER_CATEGORY = exports.ProviderId = void 0;
// ============================================================================
// PROVIDER ENUM (Centralized)
// ============================================================================
var ProviderId;
(function (ProviderId) {
    // Email Providers
    ProviderId["EMAIL_SMTP"] = "email-smtp";
    ProviderId["EMAIL_SENDGRID"] = "email-sendgrid";
    ProviderId["EMAIL_SES"] = "email-ses";
    ProviderId["EMAIL_RESEND"] = "email-resend";
    ProviderId["GMAIL_API"] = "gmail-api";
    // Messaging Providers
    ProviderId["WHATSAPP_BUSINESS"] = "whatsapp-business";
    ProviderId["WHATSAPP_BUSINESS_NOTIFICATIONS"] = "whatsapp-business-notifications";
    ProviderId["FACEBOOK_MESSENGER"] = "facebook-messenger";
    ProviderId["TELEGRAM_BOT"] = "telegram-bot";
    ProviderId["SMS_TWILIO"] = "sms-twilio";
    ProviderId["PUSH_FIREBASE"] = "push-firebase";
    ProviderId["PUSH_ONESIGNAL"] = "push-onesignal";
    ProviderId["GATEWAY_WHATSAPP"] = "gateway-whatsapp";
    // Social Media Providers
    ProviderId["INSTAGRAM_MESSAGING"] = "instagram-messaging";
    ProviderId["LINKEDIN_MESSAGING"] = "linkedin-messaging";
    ProviderId["TIKTOK_MESSAGING"] = "tiktok-messaging";
    ProviderId["TIKTOK_BUSINESS"] = "tiktok-business";
    // Payment Providers
    ProviderId["PAYMENT_ASAAS"] = "payment-asaas";
    ProviderId["PAYMENT_STRIPE"] = "payment-stripe";
    ProviderId["PAYMENT_PAYPAL"] = "payment-paypal";
    ProviderId["PAYMENT_MERCADOPAGO"] = "payment-mercadopago";
    // Calendar Providers
    ProviderId["GOOGLE_CALENDAR"] = "google-calendar";
    ProviderId["OUTLOOK_CALENDAR"] = "outlook-calendar";
    ProviderId["ICLOUD_CALENDAR"] = "icloud-calendar";
    // Web/API Providers
    ProviderId["WEBSITE_CHAT"] = "website-chat";
    ProviderId["WEBSITE_WIDGET"] = "website-widget";
    ProviderId["API_WEBHOOK"] = "api-webhook";
    // AI Providers
    ProviderId["AI_OPENAI"] = "ai-openai";
    ProviderId["AI_ANTHROPIC"] = "ai-anthropic";
    ProviderId["AI_XAI"] = "ai-xai";
    ProviderId["AI_GOOGLE"] = "ai-google";
    ProviderId["AI_MISTRAL"] = "ai-mistral";
    ProviderId["AI_DEEPSEEK"] = "ai-deepseek";
    ProviderId["AI_ELEVENLABS"] = "ai-elevenlabs";
    ProviderId["AI_COHERE"] = "ai-cohere";
    // Database Providers (Properties, Real Estate, etc.)
    ProviderId["DATABASE_JETIMOB"] = "database-jetimob";
    ProviderId["DATABASE_DWV"] = "database-dwv";
    ProviderId["DATABASE_KENLO"] = "database-kenlo";
    // Vector Storage Providers
    ProviderId["VECTOR_PINECONE"] = "vector-pinecone";
    // Meta Platform (Unified Meta services)
    ProviderId["META"] = "meta";
})(ProviderId || (exports.ProviderId = ProviderId = {}));
exports.PROVIDER_CATEGORY = {
    // Email
    [ProviderId.EMAIL_SMTP]: 'email',
    [ProviderId.EMAIL_SENDGRID]: 'email',
    [ProviderId.EMAIL_SES]: 'email',
    [ProviderId.EMAIL_RESEND]: 'email',
    [ProviderId.GMAIL_API]: 'email',
    // Messaging
    [ProviderId.WHATSAPP_BUSINESS]: 'messaging',
    [ProviderId.WHATSAPP_BUSINESS_NOTIFICATIONS]: 'messaging',
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
const isProviderCategory = (providerId, category) => {
    if (!providerId)
        return false;
    return exports.PROVIDER_CATEGORY[providerId] === category;
};
exports.isProviderCategory = isProviderCategory;
// ============================================================================
// PROVIDER CAPABILITIES (Centralized)
// ============================================================================
var ProviderCapability;
(function (ProviderCapability) {
    // Email capabilities
    ProviderCapability["SEND_EMAIL"] = "send_email";
    ProviderCapability["RECEIVE_EMAIL"] = "receive_email";
    // Messaging capabilities
    ProviderCapability["SEND_MESSAGE"] = "send_message";
    ProviderCapability["RECEIVE_MESSAGE"] = "receive_message";
    ProviderCapability["SEND_MEDIA"] = "send_media";
    ProviderCapability["RECEIVE_MEDIA"] = "receive_media";
    ProviderCapability["SEND_LOCATION"] = "send_location";
    ProviderCapability["SEND_CONTACT"] = "send_contact";
    ProviderCapability["SEND_REACTION"] = "send_reaction";
    ProviderCapability["SEND_ATTACHMENT"] = "send_attachment";
    ProviderCapability["RECEIVE_ATTACHMENT"] = "receive_attachment";
    // Notification capabilities
    ProviderCapability["SEND_SMS"] = "send_sms";
    ProviderCapability["SEND_PUSH"] = "send_push";
    /**
     * Marca a integração como remetente de códigos 2FA/verificação do SISTEMA
     * (app-level, não company). Não-exclusiva: várias integrações podem carregá-la
     * e a cascata do SystemWhatsAppService ordena por preferência de provider
     * (whatsapp-business > gateway-whatsapp).
     */
    ProviderCapability["SEND_2FA"] = "send_2fa";
    /**
     * Marca a integração como remetente de notificações de sistema (template
     * UTILITY genérico) via WhatsApp Oficial (Sistema). Independente de
     * SEND_2FA — viabilidade é resolvida por-capability (template próprio,
     * `config.templates.notification`).
     */
    ProviderCapability["SEND_NOTIFICATION"] = "send_notification";
    // Social media capabilities
    ProviderCapability["CREATE_POST"] = "create_post";
    ProviderCapability["CREATE_STORY"] = "create_story";
    ProviderCapability["CREATE_CAMPAIGN"] = "create_campaign";
    // Advanced capabilities
    ProviderCapability["CREATE_EVENT"] = "create_event";
    ProviderCapability["CREATE_TEMPLATE"] = "create_template";
    ProviderCapability["TRACK_DELIVERY"] = "track_delivery";
    ProviderCapability["TRACK_OPENS"] = "track_opens";
    ProviderCapability["TRACK_CLICKS"] = "track_clicks";
    ProviderCapability["SCHEDULE_MESSAGE"] = "schedule_message";
    // Calendar capabilities
    ProviderCapability["CALENDAR_SYNC"] = "calendar_sync";
    ProviderCapability["CALENDAR_READ"] = "calendar_read";
    ProviderCapability["CALENDAR_WRITE"] = "calendar_write";
    // Sync capabilities
    ProviderCapability["SYNC_DATA"] = "sync_data";
    // Payment capabilities
    ProviderCapability["PROCESS_PAYMENT"] = "process_payment";
    ProviderCapability["PROCESS_SUBSCRIPTION"] = "process_subscription";
    ProviderCapability["TOKENIZE_CARD"] = "tokenize_card";
    ProviderCapability["REFUND_PAYMENT"] = "refund_payment";
    ProviderCapability["CANCEL_SUBSCRIPTION"] = "cancel_subscription";
    // CRM capabilities
    ProviderCapability["CREATE_CONTACT"] = "create_contact";
    ProviderCapability["UPDATE_CONTACT"] = "update_contact";
    ProviderCapability["CREATE_LIST"] = "create_list";
    ProviderCapability["SEND_BULK"] = "send_bulk";
    ProviderCapability["BULK_SEND"] = "bulk_send";
    // Webhook capabilities
    ProviderCapability["CREATE_WEBHOOK"] = "create_webhook";
    ProviderCapability["RECEIVE_WEBHOOK"] = "receive_webhook";
    ProviderCapability["VERIFY_WEBHOOK"] = "verify_webhook";
    ProviderCapability["SEND_WEBHOOK"] = "send_webhook";
    // Form capabilities
    ProviderCapability["CREATE_FORM"] = "create_form";
    ProviderCapability["SUBMIT_FORM"] = "submit_form";
    ProviderCapability["CREATE_SURVEY"] = "create_survey";
    ProviderCapability["RECEIVE_FORM"] = "receive_form";
    // Widget capabilities
    ProviderCapability["CREATE_WIDGET"] = "create_widget";
    ProviderCapability["TRACK_VISITOR"] = "track_visitor";
    ProviderCapability["LIVE_CHAT"] = "live_chat";
    // API capabilities
    ProviderCapability["REST_API"] = "rest_api";
    ProviderCapability["GRAPHQL"] = "graphql";
    // Analytics capabilities
    ProviderCapability["GET_INSIGHTS"] = "get_insights";
    ProviderCapability["GET_AUDIENCE"] = "get_audience";
    ProviderCapability["TRACK_OPEN"] = "track_open";
    // Bot capabilities
    ProviderCapability["CREATE_BOT"] = "create_bot";
    // Page management
    ProviderCapability["MANAGE_PAGE"] = "manage_page";
    // Account management
    ProviderCapability["MANAGE_ACCOUNT"] = "manage_account";
    // AI Capabilities
    ProviderCapability["GENERATE_EMBEDDING"] = "generate_embedding";
    ProviderCapability["RERANK"] = "rerank";
    ProviderCapability["VECTOR_STORAGE"] = "vector_storage";
    ProviderCapability["AI_TEXT_GENERATION"] = "ai_text_generation";
    ProviderCapability["AI_CHAT_COMPLETION"] = "ai_chat_completion";
    // Internal subagents (services da plataforma TROIA que usam LLM, agrupados por afinidade funcional).
    // Cada tenant marca essas capabilities na integration que quer usar para cada grupo.
    ProviderCapability["AI_INTERNAL_JUDGE"] = "ai_internal_judge";
    ProviderCapability["AI_INTERNAL_PROCESSING"] = "ai_internal_processing";
    ProviderCapability["AI_INTERNAL_ANALYTICS"] = "ai_internal_analytics";
    ProviderCapability["AI_INTERNAL_IMPORTING"] = "ai_internal_importing";
    ProviderCapability["TEXT_TO_SPEECH"] = "text_to_speech";
    ProviderCapability["SPEECH_TO_TEXT"] = "speech_to_text";
    // Template Management
    ProviderCapability["TEMPLATE_MANAGEMENT"] = "template_management";
    // Database Capabilities (Properties, Real Estate, etc.)
    ProviderCapability["FETCH_PROPERTIES"] = "fetch_properties";
    ProviderCapability["SYNC_PROPERTIES"] = "sync_properties";
    ProviderCapability["CREATE_PROPERTY"] = "create_property";
    ProviderCapability["UPDATE_PROPERTY"] = "update_property";
    ProviderCapability["DELETE_PROPERTY"] = "delete_property";
    // Meta Platform Capabilities
    ProviderCapability["SOCIAL_LOGIN"] = "social_login";
    ProviderCapability["WHATSAPP_EMBEDDED_SIGNUP"] = "whatsapp_embedded_signup";
    // Voice Cloning capabilities
    ProviderCapability["VOICE_CLONING"] = "voice_cloning";
    // Batch & Domain Management capabilities
    ProviderCapability["BATCH_SEND"] = "batch_send";
    ProviderCapability["DOMAIN_MANAGEMENT"] = "domain_management"; // Manage email domains (DNS, verification)
})(ProviderCapability || (exports.ProviderCapability = ProviderCapability = {}));

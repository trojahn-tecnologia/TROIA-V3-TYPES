export declare enum CreditCategory {
    MESSAGE_CHAT = "message.chat",
    MESSAGE_AI = "message.ai",
    MESSAGE_CAMPAIGN = "message.campaign",
    MESSAGE_NOTIFICATION = "message.notification",
    AI_TOKENS_INPUT = "ai.tokens.input",
    AI_TOKENS_OUTPUT = "ai.tokens.output",
    AI_TOOL_EXECUTION = "ai.tool.execution",
    AI_VOICE_CLONE = "ai.voice.clone",
    CRM_LEAD_CREATED = "crm.lead.created",
    CRM_TICKET_OPENED = "crm.ticket.opened",
    CRM_CONTACT_CREATED = "crm.contact.created",
    AUTOMATION_WORKFLOW_EXECUTED = "automation.workflow.executed",
    AUTOMATION_FORM_RESPONSE = "automation.form.response",
    INFRA_USER_ACTIVE = "infra.user.active",
    INFRA_CHANNEL_ACTIVE = "infra.channel.active",
    INFRA_EMAIL_DOMAIN = "infra.email.domain",
    INFRA_DATABASE_SYNC = "infra.database.sync",
    WEBSITE_SITE_PUBLISHED = "website.site.published",
    API_EXTERNAL_CALL = "api.external.call"
}
export type CreditUnit = 'per_action' | 'per_1k_tokens' | 'per_month' | 'per_day';
export interface CreditCategoryConfig {
    label: string;
    unit: CreditUnit;
    hasDirection: boolean;
    hasProviderId: boolean;
    providerType?: 'messaging' | 'ai_model';
}
export declare const CREDIT_CATEGORIES: Record<CreditCategory, CreditCategoryConfig>;
export interface CreditCostEntry {
    category: CreditCategory;
    providerId?: string;
    direction?: 'inbound' | 'outbound';
    cost: number;
    unit: CreditUnit;
    description?: string;
}
export interface CompanyCard {
    providerId: string;
    integrationId: string;
    customerId: string;
    tokenId: string;
    number: string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
    holderName: string;
    brand: string;
    nickname?: string;
    isDefault: boolean;
    createdAt: Date;
}
export interface CompanyCardResponse {
    providerId: string;
    integrationId: string;
    maskedNumber: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    holderName: string;
    nickname?: string;
    isDefault: boolean;
    createdAt: string;
}
export interface CreditBalance {
    balance: number;
    totalCreditsIn: number;
    totalCreditsOut: number;
    lastDebitAt?: Date;
    lastCreditAt?: Date;
}
export type CreditSubscriptionStatus = 'pending' | 'active' | 'past_due' | 'suspended' | 'cancelled';
export type CreditPaymentMethod = 'credit_card' | 'pix';
export interface CreditSubscription {
    planId: string;
    creditsPerCycle: number;
    cycleDays: number;
    currentCycleStart: Date;
    currentCycleEnd: Date;
    nextRenewalAt: Date;
    autoRecharge: {
        enabled: boolean;
        thresholdBalance: number;
        rechargeAmount: number;
        maxRechargesPerCycle?: number;
    };
    paymentMethod: CreditPaymentMethod;
    defaultCardIndex?: number;
    payment: {
        lastAttemptAt?: Date;
        failedAttempts: number;
        nextRetryAt?: Date;
        lastError?: string;
        suspendedAt?: Date;
        cancelledAt?: Date;
    };
    status: CreditSubscriptionStatus;
}
export interface CreditAlert {
    trigger: {
        type: 'balance_below' | 'daily_consumption_above';
        value: number;
    };
    notification: {
        channels: ('socket' | 'email' | 'whatsapp')[];
        recipients: string[];
    };
    lastTriggeredAt?: Date;
    cooldownMinutes: number;
    enabled: boolean;
}
export type CreditInvoiceStatus = 'open' | 'closed';
export interface CreditInvoice {
    cycleNumber: number;
    period: {
        start: Date;
        end: Date;
    };
    summary: {
        balanceBefore: number;
        totalCreditsIn: number;
        totalCreditsOut: number;
        expired: number;
        balanceAfter: number;
    };
    status: CreditInvoiceStatus;
    closedAt?: Date;
    createdAt: Date;
}
export type CreditTransactionType = 'debit' | 'credit';
export type CreditTransactionSource = 'subscription' | 'purchase' | 'auto_recharge' | 'consumption' | 'recurring' | 'refund' | 'admin' | 'expiration';
export interface CreditTransactionMetadata {
    conversationId?: string;
    campaignId?: string;
    contactId?: string;
    leadId?: string;
    agentId?: string;
    modelId?: string;
    tokensInput?: number;
    tokensOutput?: number;
    workflowId?: string;
    description?: string;
}
export interface CreditTransaction {
    companyId: string;
    appId: string;
    type: CreditTransactionType;
    amount: number;
    balanceAfter: number;
    category: CreditCategory;
    providerId?: string;
    direction?: 'inbound' | 'outbound';
    metadata: CreditTransactionMetadata;
    source: CreditTransactionSource;
    createdAt: Date;
}
export interface CreditTransactionResponse {
    id: string;
    companyId: string;
    appId: string;
    type: CreditTransactionType;
    amount: number;
    balanceAfter: number;
    category: CreditCategory;
    providerId?: string;
    direction?: 'inbound' | 'outbound';
    metadata: CreditTransactionMetadata;
    source: CreditTransactionSource;
    createdAt: string;
}
export interface AddCardRequest {
    number: string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
    holderName: string;
    nickname?: string;
    setAsDefault?: boolean;
}
export interface SubscribePlanRequest {
    planId: string;
    paymentMethod: CreditPaymentMethod;
    cardIndex?: number;
    newCard?: AddCardRequest;
    cycle: 'monthly' | 'yearly';
}
export interface PurchaseCreditsRequest {
    amount: number;
    paymentMethod: CreditPaymentMethod;
    cardIndex?: number;
    newCard?: AddCardRequest;
}
export interface UpdateAutoRechargeRequest {
    enabled: boolean;
    thresholdBalance?: number;
    rechargeAmount?: number;
    maxRechargesPerCycle?: number;
}
export interface CreateCreditAlertRequest {
    trigger: {
        type: 'balance_below' | 'daily_consumption_above';
        value: number;
    };
    notification: {
        channels: ('socket' | 'email' | 'whatsapp')[];
        recipients: string[];
    };
    cooldownMinutes: number;
}
export interface CreditDashboardResponse {
    balance: number;
    totalCreditsIn: number;
    totalCreditsOut: number;
    subscription: {
        planId: string;
        planName: string;
        creditsPerCycle: number;
        currentCycleStart: string;
        currentCycleEnd: string;
        nextRenewalAt: string;
        status: CreditSubscriptionStatus;
        paymentMethod: CreditPaymentMethod;
    } | null;
    consumptionByCategory: Array<{
        category: CreditCategory;
        total: number;
    }>;
    autoRecharge: {
        enabled: boolean;
        thresholdBalance: number;
        rechargeAmount: number;
    };
}
export interface InvoiceDetailResponse {
    invoice: CreditInvoice;
    transactions: CreditTransactionResponse[];
}
export interface OutboundMessageJob {
    companyId: string;
    appId: string;
    channelId: string;
    conversationId?: string;
    messageId?: string;
    campaignMessageId?: string;
    leadId?: string;
    agentId?: string;
    source: 'campaign' | 'trigger' | 'notification';
    providerId: string;
    integrationId: string;
    creditCategory: CreditCategory;
    creditCost: number;
}
export interface ChannelWarmup {
    enabled: boolean;
    startedAt: Date;
    dayNumber: number;
    dailyLimit: number;
    sentToday: number;
    lastActivityAt: Date;
}

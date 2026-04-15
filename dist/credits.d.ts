export declare enum CreditCategory {
    MESSAGE_CHAT = "message.chat",
    MESSAGE_AI = "message.ai",
    MESSAGE_CAMPAIGN = "message.campaign",
    MESSAGE_NOTIFICATION = "message.notification",
    AI_TOKENS_INPUT = "ai.tokens.input",
    AI_TOKENS_OUTPUT = "ai.tokens.output",
    AI_TOOL_EXECUTION = "ai.tool.execution",
    AI_VOICE_CLONE = "ai.voice.clone",
    AI_AGENT_TRAINING = "ai.agent.training",
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
    API_EXTERNAL_CALL = "api.external.call",
    BILLING_SUBSCRIPTION = "billing.subscription",
    BILLING_PURCHASE = "billing.purchase",
    BILLING_EXPIRATION = "billing.expiration",
    BILLING_CANCELLATION = "billing.cancellation",
    ADMIN_ADJUSTMENT = "admin.adjustment",
    AI_CONVERSATION_QA = "ai.conversation.qa"
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
    tokenId?: string;
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
export type CreditSubscriptionStatus = 'pending' | 'active' | 'awaiting_payment' | 'past_due' | 'suspended' | 'cancelled';
export type CreditPaymentMethod = 'credit_card' | 'pix';
/** Pending plan change — upgrade (awaiting PIX payment) or downgrade (scheduled for next cycle) */
export interface PendingPlanChange {
    planId: string;
    planName: string;
    creditsPerCycle: number;
    effectiveAt: Date;
    type: 'upgrade' | 'downgrade';
    /** Asaas payment ID — only for PIX upgrades awaiting payment */
    pendingPaymentId?: string;
    /** Pro-rata charge amount — only for upgrades */
    proRataCharge?: number;
    /** Additional credits to inject on confirmation — only for upgrades */
    additionalCredits?: number;
}
/** Result of PUT /credits/plan */
export interface ChangePlanResult {
    type: 'upgrade' | 'downgrade';
    effectiveAt: 'immediate' | 'next_cycle' | 'pending_payment';
    additionalCredits?: number;
    proRataCharge?: number;
    pixData?: {
        qrCode: string;
        copyPaste: string;
        expiresAt: string;
        paymentId: string;
    };
}
export interface CreditSubscription {
    planId: string;
    creditsPerCycle: number;
    cycleDays: number;
    subscribedAt: Date;
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
    pendingPaymentId?: string;
    payment: {
        lastAttemptAt?: Date;
        failedAttempts: number;
        nextRetryAt?: Date;
        lastError?: string;
        suspendedAt?: Date;
        cancelledAt?: Date;
    };
    status: CreditSubscriptionStatus;
    pendingPlanChange?: PendingPlanChange;
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
export type CreditInvoiceStatus = 'open' | 'closed' | 'cancelled';
export interface CreditInvoicePayment {
    amount: number;
    discount: number;
    total: number;
    currency: string;
}
export interface CreditInvoice {
    cycleNumber: number;
    period: {
        start: Date;
        end: Date;
    };
    planId?: string;
    planName?: string;
    payment?: CreditInvoicePayment;
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
export type CreditTransactionSource = 'subscription' | 'purchase' | 'auto_recharge' | 'consumption' | 'recurring' | 'refund' | 'admin' | 'expiration' | 'cancellation';
export interface CreditTransactionMetadata {
    conversationId?: string;
    channelId?: string;
    campaignId?: string;
    contactId?: string;
    leadId?: string;
    agentId?: string;
    modelId?: string;
    tokensInput?: number;
    tokensOutput?: number;
    workflowId?: string;
    nodeId?: string;
    toolNames?: string[];
    url?: string;
    description?: string;
    adminName?: string;
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
        pendingPlanChange?: {
            planId: string;
            planName: string;
            creditsPerCycle: number;
            effectiveAt: string;
            type: 'upgrade' | 'downgrade';
            pendingPaymentId?: string;
            proRataCharge?: number;
            additionalCredits?: number;
        };
    } | null;
    consumptionByCategory: Array<{
        category: CreditCategory;
        total: number;
    }>;
    autoRecharge: {
        enabled: boolean;
        thresholdBalance: number;
        rechargeAmount: number;
        maxRechargesPerCycle?: number;
    };
}
export interface InvoiceCategoryConsumption {
    category: CreditCategory;
    total: number;
}
export interface InvoiceDetailResponse {
    invoice: CreditInvoice;
    transactions: CreditTransactionResponse[];
    consumptionByCategory: InvoiceCategoryConsumption[];
}
export interface PixQrCodeResponse {
    qrCode: string;
    copyPaste: string;
    expiresAt: string;
}
export interface ConsumptionByDayItem {
    date: string;
    categories: Record<string, number>;
    total: number;
}
export interface ConsumptionByDayResponse {
    items: ConsumptionByDayItem[];
    period: {
        start: string;
        end: string;
    };
    totals: Array<{
        category: CreditCategory;
        total: number;
    }>;
}
export interface TransactionListParams {
    category?: CreditCategory;
    type?: CreditTransactionType;
    source?: CreditTransactionSource;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export interface TransactionListResult {
    items: CreditTransactionResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export type OutboundSource = 'campaign' | 'trigger' | 'follow-up' | 'workflow';
export interface OutboundMessageJob {
    source: OutboundSource;
    appId: string;
    companyId: string;
    integrationId: string;
    channelId: string;
    campaignId?: string;
    campaignMessageId?: string;
    leadId?: string;
    agentId?: string;
    followUpId?: string;
    followUpActionId?: string;
    contactId?: string;
    workflowExecutionId?: string;
    workflowNodeId?: string;
    messageContent?: string;
    targetContactIds?: string[];
    targetConversationId?: string;
}
export interface ChannelWarmup {
    enabled: boolean;
    startedAt: Date;
    dayNumber: number;
    dailyLimit: number;
    sentToday: number;
    lastActivityAt: Date;
}

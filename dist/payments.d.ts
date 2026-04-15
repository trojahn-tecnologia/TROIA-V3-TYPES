/**
 * Payment Provider System Types
 * Universal payment processing interfaces for TROIA V3
 */
import { PaginationQuery, ListResponse } from './common';
export declare enum PaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    PIX = "PIX",
    BOLETO = "BOLETO",
    TED = "TED",
    BANK_TRANSFER = "BANK_TRANSFER",
    CRYPTO = "CRYPTO"
}
export declare enum PaymentCapability {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    PIX = "pix",
    BOLETO = "boleto",
    TED = "ted",
    BANK_TRANSFER = "bank_transfer",
    CRYPTO = "crypto",
    CUSTOMER_CREATION = "customer_creation",
    CUSTOMER_UPDATE = "customer_update",
    CUSTOMER_DELETION = "customer_deletion",
    TOKENIZATION = "tokenization",
    TOKEN_UPDATE = "token_update",
    TOKEN_DELETION = "token_deletion",
    INSTALLMENTS = "installments",
    RECURRING_PAYMENTS = "recurring_payments",
    SUBSCRIPTIONS = "subscriptions",
    REFUNDS = "refunds",
    SPLIT_PAYMENTS = "split_payments",
    WEBHOOKS = "webhooks",
    ANTI_FRAUD = "anti_fraud",
    CHARGEBACK_PROTECTION = "chargeback_protection",
    POS_INTEGRATION = "pos_integration",
    MOBILE_PAYMENTS = "mobile_payments",
    QR_CODE_GENERATION = "qr_code_generation"
}
export declare enum RecurringStrategy {
    TOKENIZATION = "tokenization",// Internal cron jobs
    SUBSCRIPTION = "subscription"
}
export declare enum PaymentBillingCycle {
    WEEKLY = "WEEKLY",
    BIWEEKLY = "BIWEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMIANNUALLY = "SEMIANNUALLY",
    YEARLY = "YEARLY"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    CONFIRMED = "CONFIRMED",
    RECEIVED = "RECEIVED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    OVERDUE = "OVERDUE"
}
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    OVERDUE = "OVERDUE",
    TRIAL = "TRIAL"
}
export interface AddressData {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export interface CustomerData {
    name: string;
    email: string;
    document: string;
    documentType: 'CPF' | 'CNPJ';
    phone?: string;
    birthDate?: string;
    address?: AddressData;
    company?: string;
    providerCustomerId?: string;
    externalReference?: string;
    metadata?: Record<string, unknown>;
}
export interface CardData {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
    holderDocument?: string;
    address?: AddressData;
    phone?: string;
    email?: string;
}
export interface UniversalPaymentData {
    amount: number;
    currency: string;
    description: string;
    paymentMethod: PaymentMethod;
    dueDate?: string;
    externalReference?: string;
    metadata?: Record<string, unknown>;
    customer: CustomerData;
    creditCard?: CreditCardData;
    pix?: PIXSpecificData;
    boleto?: BoletoSpecificData;
    installments?: number;
}
export interface CreditCardData {
    holderName: string;
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    holderDocument?: string;
}
export interface PIXSpecificData {
    expirationMinutes?: number;
    pixKey?: string;
}
export interface BoletoSpecificData {
    dueDate: string;
    fine?: FineData;
    interest?: InterestData;
    discount?: DiscountData;
}
export interface FineData {
    value: number;
    type: 'FIXED' | 'PERCENTAGE';
}
export interface InterestData {
    value: number;
    type: 'PERCENTAGE';
}
export interface DiscountData {
    value: number;
    type: 'FIXED' | 'PERCENTAGE';
    dueDateLimitDays: number;
}
export interface PaymentResponse {
    paymentId: string;
    customerId?: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    pix?: PIXResponse;
    boleto?: BoletoResponse;
    creditCard?: CreditCardResponse;
    externalReference?: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
    providerData?: Record<string, unknown>;
}
export interface PIXResponse {
    qrCodeBase64?: string;
    qrCodeText?: string;
    pixKey?: string;
    expirationDate?: string;
}
export interface BoletoResponse {
    boletoUrl?: string;
    digitableLine?: string;
    barcode?: string;
    expirationDate?: string;
}
export interface CreditCardResponse {
    authorizationCode?: string;
    installments?: number;
    maskedNumber?: string;
    transactionId?: string;
}
export interface PaymentCustomerResponse {
    id: string;
    externalReference?: string;
    name: string;
    email: string;
    phone?: string;
    document: string;
    documentType: 'CPF' | 'CNPJ';
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'DELETED';
    createdAt: string;
    updatedAt: string;
    providerData?: Record<string, unknown>;
}
export interface PaymentCustomerListResponse extends ListResponse<PaymentCustomerResponse> {
}
export interface CustomerFilters {
    name?: string;
    email?: string;
    document?: string;
    status?: string;
}
export interface PaymentCustomerQuery extends PaginationQuery {
    filters?: CustomerFilters;
}
export interface TokenResponse {
    tokenId: string;
    customerId: string;
    maskedNumber: string;
    brand: string;
    holderName: string;
    expiryMonth: string;
    expiryYear: string;
    status: 'ACTIVE' | 'EXPIRED' | 'BLOCKED';
    createdAt: string;
    providerData?: Record<string, unknown>;
}
export interface TokenListResponse {
    tokens: TokenResponse[];
    totalCount: number;
}
export interface TokenPaymentData {
    amount: number;
    currency: string;
    description: string;
    installments?: number;
    dueDate?: string;
    externalReference?: string;
    metadata?: Record<string, unknown>;
}
export interface SubscriptionData {
    customerId: string;
    paymentMethod: PaymentMethod;
    amount: number;
    currency: string;
    cycle: PaymentBillingCycle;
    description: string;
    startDate?: string;
    nextDueDate?: string;
    endDate?: string;
    maxPayments?: number;
    trialPeriodDays?: number;
    tokenId?: string;
    externalReference?: string;
    metadata?: Record<string, unknown>;
}
export interface SubscriptionResponse {
    subscriptionId: string;
    customerId: string;
    amount: number;
    currency: string;
    cycle: PaymentBillingCycle;
    status: SubscriptionStatus;
    paymentMethod: PaymentMethod;
    createdAt: string;
    startDate: string;
    nextDueDate: string;
    endDate?: string;
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    trialPeriodDays?: number;
    isInTrial: boolean;
    externalReference?: string;
    providerData?: Record<string, unknown>;
}
export interface SubscriptionPaymentListResponse {
    subscriptionId: string;
    payments: {
        paymentId: string;
        amount: number;
        status: PaymentStatus;
        dueDate: string;
        paymentDate?: string;
        cycle: PaymentBillingCycle;
        createdAt: string;
    }[];
    totalCount: number;
    hasMore: boolean;
}
export interface RecurringPaymentSetup {
    strategy: RecurringStrategy;
    customerId: string;
    paymentMethod: PaymentMethod;
    amount: number;
    currency: string;
    cycle: PaymentBillingCycle;
    description: string;
    tokenization?: {
        tokenId: string;
        cronExpression: string;
        maxRetries: number;
    };
    subscription?: {
        trialPeriodDays?: number;
        maxPayments?: number;
        endDate?: string;
    };
    externalReference?: string;
    metadata?: Record<string, unknown>;
}
export interface RecurringSetupResponse {
    setupId: string;
    strategy: RecurringStrategy;
    status: 'ACTIVE' | 'SCHEDULED' | 'PAUSED' | 'FAILED';
    managedBy: 'INTERNAL_CRON' | 'PROVIDER_NATIVE';
    nextExecutionDate?: string;
    providerData?: Record<string, unknown>;
}
export interface TokenizationSetupResponse {
    setupId: string;
    customerId: string;
    tokenId: string;
    strategy: RecurringStrategy;
    cronExpression: string;
    nextExecutionDate: string;
    managedBy: 'INTERNAL_CRON';
    providerData: Record<string, unknown>;
}
export interface WebhookResponse {
    eventType: string;
    paymentId?: string;
    subscriptionId?: string;
    customerId?: string;
    status?: PaymentStatus;
    amount?: number;
    metadata?: Record<string, unknown>;
    providerData?: Record<string, unknown>;
}
export interface CancelResponse {
    success: boolean;
    paymentId: string;
    status: PaymentStatus;
    cancelledAt: string;
    reason?: string;
}
export interface RefundResponse {
    refundId: string;
    paymentId: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    refundedAt: string;
    reason?: string;
}
export interface CancelSubscriptionResponse {
    subscriptionId: string;
    status: SubscriptionStatus;
    cancelledAt: string;
    reason?: string;
}
export interface PaymentFilters {
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    amountFrom?: number;
    amountTo?: number;
}
export interface PaymentQuery extends PaginationQuery {
    filters?: PaymentFilters;
}
export interface PaymentListResponse extends ListResponse<PaymentResponse> {
}
export interface PaymentDetails extends PaymentResponse {
    events: {
        eventType: string;
        timestamp: string;
        description: string;
        metadata?: Record<string, unknown>;
    }[];
}
export interface PaymentProviderConfig {
    apiKey: string;
    baseUrl?: string;
    webhookSecret?: string;
    isSandbox?: boolean;
    environment?: 'sandbox' | 'production';
    merchantId?: string;
    publicKey?: string;
    secretKey?: string;
    customSettings?: Record<string, unknown>;
    configSource?: 'app' | 'company';
    appId?: string;
    companyId?: string;
    accountStatus?: 'pending' | 'approved' | 'rejected';
}
export interface RecurringPaymentConfig {
    enabled: boolean;
    strategy: RecurringStrategy;
    tokenization?: {
        enableAutoBilling: boolean;
        cronSchedule: string;
        retryAttempts: number;
        retryIntervalHours: number;
        failureNotifications: NotificationConfig;
    };
    subscription?: {
        enableNativeSubscriptions: boolean;
        defaultCycle: PaymentBillingCycle;
        supportedCycles: PaymentBillingCycle[];
        allowTrialPeriods: boolean;
        trialPeriodDays?: number;
        failureNotifications: NotificationConfig;
    };
    webhooks: {
        enabled: boolean;
        notificationEmails: string[];
        slackWebhook?: string;
    };
}
export interface NotificationConfig {
    enableEmailAlerts: boolean;
    enableSlackAlerts: boolean;
    escalationEmails: string[];
    maxFailuresBeforeEscalation: number;
}
export declare enum SubscriptionContext {
    APP_PLAN = "app_plan",// Company subscribes to App plan
    COMPANY_SERVICE = "company_service"
}
export interface TokenizedSubscription {
    id: string;
    appId: string;
    companyId: string;
    context: SubscriptionContext;
    contextId: string;
    contextType?: string;
    userId?: string;
    savedCardId?: string;
    customerId?: string;
    tokenId?: string;
    providerId?: string;
    planId?: string;
    serviceId?: string;
    amount: number;
    currency: string;
    cycle: PaymentBillingCycle;
    description: string;
    nextChargeDate: Date;
    cronExpression: string;
    status: 'ACTIVE' | 'PAUSED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
    failureCount: number;
    maxFailures: number;
    lastAttemptAt?: Date;
    lastSuccessAt?: Date;
    retryIntervalHours: number;
    externalReference?: string;
    metadata?: Record<string, unknown>;
}
export interface CreateSubscriptionWithSavedCardRequest {
    userId: string;
    savedCardId: string;
    planId?: string;
    serviceId?: string;
    amount: number;
    currency: string;
    cycle: PaymentBillingCycle;
    description: string;
    cronExpression?: string;
    maxFailures?: number;
    retryIntervalHours?: number;
    externalReference?: string;
    metadata?: Record<string, unknown>;
}
export interface CreateSubscriptionResponse {
    id: string;
    status: 'ACTIVE' | 'SCHEDULED' | 'FAILED';
    context: SubscriptionContext;
    contextEntity?: Record<string, unknown>;
    nextChargeDate: string;
    message: string;
    subscription?: TokenizedSubscription;
}
export interface UpdateSubscriptionCardRequest {
    newSavedCardId: string;
    reason?: string;
}
export interface SubscriptionStats {
    total: number;
    active: number;
    paused: number;
    failed: number;
    cancelled: number;
    expired: number;
    totalMonthlyRevenue: number;
    avgFailureRate: number;
}
export interface CompanyService {
    companyId: string;
    appId: string;
    name: string;
    type: string;
    price: number;
    currency: string;
    billingCycle: PaymentBillingCycle;
    description: string;
    status: 'active' | 'inactive' | 'draft';
    features?: string[];
    terms?: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, unknown>;
}
export interface CreateCompanyServiceRequest {
    name: string;
    type: string;
    price: number;
    currency?: string;
    billingCycle: PaymentBillingCycle;
    description: string;
    features?: string[];
    terms?: string;
    metadata?: Record<string, unknown>;
}
export interface CompanyServiceResponse {
    companyId: string;
    appId: string;
    name: string;
    type: string;
    price: number;
    currency: string;
    billingCycle: PaymentBillingCycle;
    description: string;
    status: 'active' | 'inactive' | 'draft';
    features?: string[];
    terms?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, unknown>;
}
export interface CompanyServiceQuery extends PaginationQuery {
    filters?: {
        type?: string;
        status?: string;
        priceFrom?: number;
        priceTo?: number;
    };
}
export interface CompanyServiceListResponse extends ListResponse<CompanyServiceResponse> {
}
export interface CompanyServiceActivation {
    serviceId: string;
    companyId: string;
    subscriptionId: string;
    customerCompanyId?: string;
    customerUserId?: string;
    status: 'active' | 'inactive' | 'expired';
    activatedAt: Date;
    expiresAt?: Date;
    deactivatedAt?: Date;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, unknown>;
}
export interface PaymentContext {
    type: 'APP_SUBSCRIPTION' | 'COMPANY_SUBSCRIPTION' | 'ORDER_PAYMENT' | 'CUSTOM';
    entityId: string;
    customerId: string;
    providerId: string;
    metadata: Record<string, unknown>;
}
export interface PaymentError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    provider?: string;
    paymentId?: string;
}
export interface ValidationResult {
    isValid: boolean;
    issues: string[];
    currentEnvironment?: 'sandbox' | 'production';
}

/**
 * Payment Provider System Types
 * Universal payment processing interfaces for TROIA V3
 */

import { PaginationQuery, ListResponse, GenericQueryOptions } from './common';

// ================================
// CORE ENUMS
// ================================

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
  TED = 'TED',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CRYPTO = 'CRYPTO'
}

export enum PaymentCapability {
  // Payment Methods
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BOLETO = 'boleto',
  TED = 'ted',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto',

  // Customer Management
  CUSTOMER_CREATION = 'customer_creation',
  CUSTOMER_UPDATE = 'customer_update',
  CUSTOMER_DELETION = 'customer_deletion',

  // Tokenization
  TOKENIZATION = 'tokenization',
  TOKEN_UPDATE = 'token_update',
  TOKEN_DELETION = 'token_deletion',

  // Advanced Features
  INSTALLMENTS = 'installments',
  RECURRING_PAYMENTS = 'recurring_payments',
  SUBSCRIPTIONS = 'subscriptions',
  REFUNDS = 'refunds',
  SPLIT_PAYMENTS = 'split_payments',
  WEBHOOKS = 'webhooks',
  ANTI_FRAUD = 'anti_fraud',
  CHARGEBACK_PROTECTION = 'chargeback_protection',

  // Integrations
  POS_INTEGRATION = 'pos_integration',
  MOBILE_PAYMENTS = 'mobile_payments',
  QR_CODE_GENERATION = 'qr_code_generation'
}

export enum RecurringStrategy {
  TOKENIZATION = 'tokenization',  // Internal cron jobs
  SUBSCRIPTION = 'subscription'   // Provider native subscriptions
}

export enum PaymentBillingCycle {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUALLY = 'SEMIANNUALLY',
  YEARLY = 'YEARLY'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  RECEIVED = 'RECEIVED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  OVERDUE = 'OVERDUE'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  OVERDUE = 'OVERDUE',
  TRIAL = 'TRIAL'
}

// ================================
// CORE DATA STRUCTURES
// ================================

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
  metadata?: Record<string, any>;
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

// ================================
// UNIVERSAL PAYMENT DATA
// ================================

export interface UniversalPaymentData {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: PaymentMethod;
  dueDate?: string;
  externalReference?: string;
  metadata?: Record<string, any>;

  // Customer data (provider decides if creates or uses inline)
  customer: CustomerData;

  // Method-specific data
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

// ================================
// PAYMENT RESPONSES
// ================================

export interface PaymentResponse {
  paymentId: string;
  customerId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;

  // Method-specific responses
  pix?: PIXResponse;
  boleto?: BoletoResponse;
  creditCard?: CreditCardResponse;

  externalReference?: string;
  createdAt: string;
  metadata?: Record<string, any>;
  providerData?: any;
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

// ================================
// CUSTOMER MANAGEMENT
// ================================

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
  providerData?: any;
}

export interface PaymentCustomerListResponse extends ListResponse<PaymentCustomerResponse> {}

export interface CustomerFilters {
  name?: string;
  email?: string;
  document?: string;
  status?: string;
}

export interface PaymentCustomerQuery extends PaginationQuery {
  filters?: CustomerFilters;
}

// ================================
// TOKENIZATION
// ================================

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
  providerData?: any;
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
  metadata?: Record<string, any>;
}

// ================================
// SUBSCRIPTIONS
// ================================

export interface SubscriptionData {
  customerId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  cycle: PaymentBillingCycle;
  description: string;

  // Timing
  startDate?: string;
  nextDueDate?: string;
  endDate?: string;
  maxPayments?: number;

  // Trial
  trialPeriodDays?: number;

  // Payment method specific
  tokenId?: string;

  // Metadata
  externalReference?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  customerId: string;
  amount: number;
  currency: string;
  cycle: PaymentBillingCycle;
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;

  // Dates
  createdAt: string;
  startDate: string;
  nextDueDate: string;
  endDate?: string;

  // Counters
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;

  // Trial info
  trialPeriodDays?: number;
  isInTrial: boolean;

  externalReference?: string;
  providerData?: any;
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

// ================================
// RECURRING PAYMENT MANAGEMENT
// ================================

export interface RecurringPaymentSetup {
  strategy: RecurringStrategy;
  customerId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  cycle: PaymentBillingCycle;
  description: string;

  // Strategy-specific configs
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
  metadata?: Record<string, any>;
}

export interface RecurringSetupResponse {
  setupId: string;
  strategy: RecurringStrategy;
  status: 'ACTIVE' | 'SCHEDULED' | 'PAUSED' | 'FAILED';
  managedBy: 'INTERNAL_CRON' | 'PROVIDER_NATIVE';
  nextExecutionDate?: string;
  providerData?: any;
}

export interface TokenizationSetupResponse {
  setupId: string;
  customerId: string;
  tokenId: string;
  strategy: RecurringStrategy;
  cronExpression: string;
  nextExecutionDate: string;
  managedBy: 'INTERNAL_CRON';
  providerData: any;
}

// ================================
// WEBHOOKS
// ================================

export interface WebhookResponse {
  eventType: string;
  paymentId?: string;
  subscriptionId?: string;
  customerId?: string;
  status?: PaymentStatus;
  amount?: number;
  metadata?: Record<string, any>;
  providerData?: any;
}

// ================================
// GENERAL RESPONSES
// ================================

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

// ================================
// FILTERS AND QUERIES
// ================================

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

export interface PaymentListResponse extends ListResponse<PaymentResponse> {}

export interface PaymentDetails extends PaymentResponse {
  events: {
    eventType: string;
    timestamp: string;
    description: string;
    metadata?: Record<string, any>;
  }[];
}

// ================================
// PROVIDER CONFIGURATION
// ================================

export interface PaymentProviderConfig {
  apiKey: string;
  baseUrl?: string;
  webhookSecret?: string;
  isSandbox?: boolean;
  environment?: 'sandbox' | 'production';
  merchantId?: string;
  publicKey?: string;
  secretKey?: string;
  customSettings?: Record<string, any>;

  // Metadata
  configSource?: 'app' | 'company';
  appId?: string;
  companyId?: string;
  accountStatus?: 'pending' | 'approved' | 'rejected';
}

// ================================
// INTEGRATION CONFIGURATIONS
// ================================

export interface RecurringPaymentConfig {
  enabled: boolean;
  strategy: RecurringStrategy;

  // For TOKENIZATION strategy
  tokenization?: {
    enableAutoBilling: boolean;
    cronSchedule: string;
    retryAttempts: number;
    retryIntervalHours: number;
    failureNotifications: NotificationConfig;
  };

  // For SUBSCRIPTION strategy
  subscription?: {
    enableNativeSubscriptions: boolean;
    defaultCycle: PaymentBillingCycle;
    supportedCycles: PaymentBillingCycle[];
    allowTrialPeriods: boolean;
    trialPeriodDays?: number;
    failureNotifications: NotificationConfig;
  };

  // Webhooks
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

// ================================
// CRON JOB SYSTEM - GENERIC CONTEXTS
// ================================

export enum SubscriptionContext {
  APP_PLAN = 'app_plan',           // Company subscribes to App plan
  COMPANY_SERVICE = 'company_service' // Customer subscribes to Company service
}

export interface TokenizedSubscription {
  id: string;
  appId: string;
  companyId: string;

  // 🔥 NEW: Generic context support for multiple subscription types
  context: SubscriptionContext;    // Defines the subscription type
  contextId: string;               // ID of the entity (planId, serviceId, etc)
  contextType?: string;            // Cache of type (basic, premium, consultoria, etc)

  // NEW: Support for saved cards integration
  userId?: string;           // User who owns the subscription
  savedCardId?: string;      // Reference to saved card

  // LEGACY: Direct tokenization (for backward compatibility)
  customerId?: string;       // ID in provider (optional now)
  tokenId?: string;          // Card token (optional now)
  providerId?: string;       // Provider ID (optional now)

  // 🔥 COMPATIBILITY: Specific context fields
  planId?: string;           // For APP_PLAN context (backward compatibility)
  serviceId?: string;        // For COMPANY_SERVICE context (future)

  amount: number;
  currency: string;
  cycle: PaymentBillingCycle;
  description: string;

  // Scheduling
  nextChargeDate: Date;
  cronExpression: string;

  // Status & retry
  status: 'ACTIVE' | 'PAUSED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  failureCount: number;
  maxFailures: number;
  lastAttemptAt?: Date;
  lastSuccessAt?: Date;

  // Config
  retryIntervalHours: number;

  externalReference?: string;
  metadata?: Record<string, any>;
}

// 🔥 NEW: Generic subscription request interfaces
export interface CreateSubscriptionWithSavedCardRequest {
  userId: string;
  savedCardId: string;

  // 🔥 CONTEXT: Either planId OR serviceId must be provided
  planId?: string;           // For APP_PLAN context
  serviceId?: string;        // For COMPANY_SERVICE context

  amount: number;
  currency: string;
  cycle: PaymentBillingCycle;
  description: string;
  cronExpression?: string;
  maxFailures?: number;
  retryIntervalHours?: number;
  externalReference?: string;
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionResponse {
  id: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'FAILED';
  context: SubscriptionContext;
  contextEntity?: any;       // Plan or Service data
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

// ================================
// COMPANY SERVICES - FUTURE FEATURE
// ================================

export interface CompanyService {
  companyId: string;
  appId: string;
  name: string;
  type: string;              // 'consultoria', 'auditoria', 'treinamento', etc
  price: number;
  currency: string;
  billingCycle: PaymentBillingCycle;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  features?: string[];       // Optional service features
  terms?: string;           // Terms and conditions
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
}

export interface CompanyServiceQuery extends PaginationQuery {
  filters?: {
    type?: string;
    status?: string;
    priceFrom?: number;
    priceTo?: number;
  };
}

export interface CompanyServiceListResponse extends ListResponse<CompanyServiceResponse> {}

// Service activation tracking
export interface CompanyServiceActivation {
  serviceId: string;
  companyId: string;           // Company offering the service
  subscriptionId: string;      // Related subscription
  customerCompanyId?: string;  // Company that subscribed to the service
  customerUserId?: string;     // User that subscribed
  status: 'active' | 'inactive' | 'expired';
  activatedAt: Date;
  expiresAt?: Date;
  deactivatedAt?: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

// ================================
// PAYMENT CONTEXTS
// ================================

export interface PaymentContext {
  type: 'APP_SUBSCRIPTION' | 'COMPANY_SUBSCRIPTION' | 'ORDER_PAYMENT' | 'CUSTOM';
  entityId: string;        // app/company/order ID
  customerId: string;      // Who pays
  providerId: string;      // Which provider to use
  metadata: Record<string, any>; // Context-specific data
}

// ================================
// ERROR HANDLING
// ================================

export interface PaymentError {
  code: string;
  message: string;
  details?: Record<string, any>;
  provider?: string;
  paymentId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  currentEnvironment?: 'sandbox' | 'production';
}
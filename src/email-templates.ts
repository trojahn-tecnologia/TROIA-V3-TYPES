import { PaginationQuery, ListResponse, GenericQueryOptions, ActiveStatus } from './common';

/**
 * Email Templates Types
 * Used for email template management system
 */

export enum EmailTemplateType {
  PASSWORD_RESET = 'password-reset',
  WELCOME = 'welcome',
  EMAIL_VERIFICATION = 'email-verification',
  INVITATION = 'invitation',
  COMPANY_REGISTRATION = 'company-registration',
  SUBSCRIPTION_ACTIVATED = 'subscription-activated',
  SUBSCRIPTION_EXPIRED = 'subscription-expired',
  PLAN_CHANGED = 'plan-changed',
  SYSTEM_NOTIFICATION = 'system-notification',
  MAINTENANCE_NOTICE = 'maintenance-notice',
  PAYMENT_PENDING = 'payment-pending',
  PAYMENT_OVERDUE = 'payment-overdue',
  INVOICE_GENERATED = 'invoice-generated'
}

export enum TemplateLevel {
  SYSTEM = 'system',    // Built-in system templates
  APP = 'app',          // App-level templates (core)
  COMPANY = 'company'   // Company-level customization
}

export interface EmailTemplateData {
  // Common variables for all templates
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  appName?: string;

  // Password reset specific
  resetLink?: string;
  expiresIn?: string;

  // Welcome specific
  loginLink?: string;
  setupLink?: string;

  // Invitation specific
  inviteLink?: string;
  inviterName?: string;
  inviterEmail?: string;
  role?: string;

  // Verification specific
  verificationLink?: string;
  verificationCode?: string;

  // Subscription specific
  planName?: string;
  planPrice?: string;
  billingPeriod?: string;
  nextBillingDate?: string;

  // System notification specific
  message?: string;
  actionUrl?: string;
  actionText?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';

  // Branding variables
  primaryColor?: string;
  logoUrl?: string;
  footer?: string;

  // Billing specific
  amount?: string;
  creditsReceived?: string;
  nextCycleDate?: string;
  previousPlanName?: string;
  effectiveAt?: string;
  proRataCharge?: string;
  additionalCredits?: string;
  pixLink?: string;
  expiresAt?: string;
  dueDate?: string;
  dashboardLink?: string;
  invoiceCycle?: string;
  period?: string;
  totalAmount?: string;

  // Notification specific
  title?: string;

  // Custom variables
  [key: string]: unknown;
}

export interface BrandingConfig {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  companyName?: string;
  footerText?: string;
}

// Generic Query Pattern
export interface EmailTemplateQuery extends PaginationQuery {
  status?: ActiveStatus;
  templateType?: string;
  level?: 'system' | 'app' | 'company';
  companyId?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

// Response Types
export interface EmailTemplateResponse {
  id: string;
  appId: string;
  companyId?: string;
  templateType: string;
  level: 'system' | 'app' | 'company';
  subject: string;
  htmlContent: string;
  textContent?: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  requiredVariables: string[];
  optionalVariables: string[];
  brandingConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    companyName?: string;
    footerText?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplateListResponse extends ListResponse<EmailTemplateResponse> {}
export interface EmailTemplateQueryOptions extends GenericQueryOptions<EmailTemplateQuery> {}

// Request Types
export interface CreateEmailTemplateRequest {
  templateType: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  requiredVariables?: string[];
  optionalVariables?: string[];
  brandingConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    companyName?: string;
    footerText?: string;
  };
}

export interface UpdateEmailTemplateRequest {
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
  requiredVariables?: string[];
  optionalVariables?: string[];
  brandingConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    companyName?: string;
    footerText?: string;
  };
}

// Render Template Request
export interface RenderTemplateRequest {
  templateType: string;
  templateData: Record<string, any>;
  companyId?: string;
}

// Template Types Response
export interface TemplateTypeResponse {
  type: string;
  name: string;
  description: string;
  defaultVariables: {
    required: string[];
    optional: string[];
  };
}

// Rendered Template Response
export interface RenderedTemplateResponse {
  subject: string;
  html: string;
  text?: string;
}
import { ObjectId } from 'mongodb';
import { PaginationQuery, ListResponse, ExtendedStatus } from './common';
import {
  SmtpConfig,
  SendGridConfig,
  WhatsAppConfig,
  FacebookMessengerConfig,
  TelegramConfig,
  TwilioSmsConfig,
  WebhookConfig,
  ProviderConfig,
  ProviderCredentials,
  ProviderId,
  CreateSmtpIntegrationRequest,
  CreateSendGridIntegrationRequest,
  CreateWhatsAppIntegrationRequest,
  CreateFacebookMessengerIntegrationRequest,
  CreateTelegramIntegrationRequest,
  CreateWebhookIntegrationRequest,
  CreateProviderIntegrationRequest,
  ProviderRateLimits,
  QualityRating
} from './providers';

// Base CompanyIntegration interface
export interface CompanyIntegration {
  companyId: ObjectId;
  appId: ObjectId;
  providerId: string; // Reference to provider in utils/providers.ts
  name: string;
  description?: string;
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
  status: ExtendedStatus;
  lastSyncAt?: Date;
  syncInterval?: number;          // ✅ Override sync interval (in minutes)
  authFailedAt?: Date;            // ✅ Timestamp when authentication failed
  failedAttempts?: number;        // ✅ Counter for failed attempts

  // Rate limiting configuration (overrides provider defaults)
  rateLimits?: ProviderRateLimits;  // Custom rate limits for this integration
  qualityRating?: QualityRating;    // WhatsApp quality rating (green, yellow, red)
  qualityRatingUpdatedAt?: Date;    // When quality rating was last updated

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// LEGACY GENERIC CONFIG (For backward compatibility)
// ============================================================================

export interface IntegrationConfig {
  // Generic fields for providers not yet specifically typed
  [key: string]: unknown;
}

// Integration credentials (encrypted in database) - using shared type from providers
export interface IntegrationCredentials extends ProviderCredentials {}

// Request/Response types following Generic + Specific pattern
export interface CompanyIntegrationQuery extends PaginationQuery {
  providerId?: string;
  status?: ExtendedStatus;
  name?: string;
}

// Company Integration Response (without credentials, with provider info)
export interface CompanyIntegrationResponse {
  id: string;
  companyId: string;
  appId: string;
  providerId: string;
  name: string;
  description?: string;
  config: IntegrationConfig;
  status: ExtendedStatus;
  capabilities: string[];
  providerName: string;
  resourceType?: string;    // Resource type ('channel', 'service', etc.)
  resourceId?: string;      // Resource ID (channel ID, service ID, etc.)
  lastSyncAt?: string;
  syncInterval?: number;    // ✅ Override sync interval (in minutes)
  lastError?: string;
  authFailedAt?: string;    // ✅ Timestamp when authentication failed
  failedAttempts?: number;  // ✅ Counter for failed attempts

  // Rate limiting configuration
  rateLimits?: ProviderRateLimits;  // Custom rate limits for this integration
  qualityRating?: QualityRating;    // WhatsApp quality rating (green, yellow, red)
  qualityRatingUpdatedAt?: string;  // When quality rating was last updated (ISO string)

  // Instance management fields (for providers like Gateway)
  instanceKey?: string;      // Key da instância no provider
  instanceToken?: string;    // Token da instância no provider
  instanceData?: Record<string, unknown>;        // Dados completos da instância

  createdAt: string;
  updatedAt: string;
}

export interface CompanyIntegrationListResponse extends ListResponse<CompanyIntegrationResponse> {}

// ============================================================================
// COMPANY-SPECIFIC TYPED REQUESTS (Using shared provider types)
// ============================================================================

// Re-export shared typed requests for company integrations
export type CreateCompanyIntegrationTypedRequest = CreateProviderIntegrationRequest;

// ============================================================================
// LEGACY GENERIC REQUEST (For backward compatibility)
// ============================================================================

export interface CreateCompanyIntegrationRequest {
  providerId: string;
  name: string;
  description?: string;
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
}

export interface UpdateCompanyIntegrationRequest {
  name?: string;
  description?: string;
  config?: Partial<IntegrationConfig>;
  credentials?: Partial<IntegrationCredentials>;
  status?: ExtendedStatus;
  lastSyncAt?: string;        // ✅ ISO 8601 timestamp
  syncInterval?: number;      // ✅ Override sync interval (in minutes)
  resourceType?: string;      // Resource type ('channel', 'service', etc.)
  resourceId?: string;        // Resource ID (channel ID, service ID, etc.)
  lastError?: string;

  // Rate limiting configuration
  rateLimits?: Partial<ProviderRateLimits>;  // Update rate limits
  qualityRating?: QualityRating;              // Update quality rating
  qualityRatingUpdatedAt?: string;            // ISO 8601 timestamp

  // Instance management fields (for providers like Gateway)
  instanceKey?: string;      // Key da instância no provider
  instanceToken?: string;    // Token da instância no provider
  instanceData?: Record<string, unknown>;        // Dados completos da instância
}

// Integration test types
export interface TestIntegrationRequest {
  integrationId: string;
  testType: 'send_email' | 'send_message' | 'send_webhook';
  testData?: Record<string, unknown>;
}

export interface TestIntegrationResponse {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
  executedAt: Date;
}

// Sync operation types
export interface SyncIntegrationRequest {
  integrationId: string;
  syncType: 'full' | 'incremental' | 'contacts' | 'messages';
  options?: Record<string, unknown>;
}

export interface SyncIntegrationResponse {
  success: boolean;
  syncedCount: number;
  errorCount: number;
  message: string;
  syncedAt: Date;
}

// Query and list types
export interface CompanyIntegrationQuery extends PaginationQuery {
  status?: ExtendedStatus;
  providerId?: string;
}
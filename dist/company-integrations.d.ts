import { ObjectId } from 'mongodb';
import { PaginationQuery, ListResponse, ExtendedStatus } from './common';
import { ProviderCredentials, CreateProviderIntegrationRequest, ProviderRateLimits, QualityRating } from './providers';
export interface CompanyIntegration {
    companyId: ObjectId;
    appId: ObjectId;
    providerId: string;
    name: string;
    description?: string;
    config: IntegrationConfig;
    credentials: IntegrationCredentials;
    status: ExtendedStatus;
    lastSyncAt?: Date;
    syncInterval?: number;
    authFailedAt?: Date;
    failedAttempts?: number;
    rateLimits?: ProviderRateLimits;
    qualityRating?: QualityRating;
    qualityRatingUpdatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IntegrationConfig {
    [key: string]: unknown;
}
export interface IntegrationCredentials extends ProviderCredentials {
}
export interface CompanyIntegrationQuery extends PaginationQuery {
    providerId?: string;
    status?: ExtendedStatus;
    name?: string;
}
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
    resourceType?: string;
    resourceId?: string;
    lastSyncAt?: string;
    syncInterval?: number;
    lastError?: string;
    authFailedAt?: string;
    failedAttempts?: number;
    rateLimits?: ProviderRateLimits;
    qualityRating?: QualityRating;
    qualityRatingUpdatedAt?: string;
    instanceKey?: string;
    instanceToken?: string;
    instanceData?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface CompanyIntegrationListResponse extends ListResponse<CompanyIntegrationResponse> {
}
export type CreateCompanyIntegrationTypedRequest = CreateProviderIntegrationRequest;
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
    lastSyncAt?: string;
    syncInterval?: number;
    resourceType?: string;
    resourceId?: string;
    lastError?: string;
    rateLimits?: Partial<ProviderRateLimits>;
    qualityRating?: QualityRating;
    qualityRatingUpdatedAt?: string;
    instanceKey?: string;
    instanceToken?: string;
    instanceData?: Record<string, unknown>;
}
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
export interface CompanyIntegrationQuery extends PaginationQuery {
    status?: ExtendedStatus;
    providerId?: string;
}

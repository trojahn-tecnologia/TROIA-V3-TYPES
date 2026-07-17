import { PaginationQuery, ListResponse, GenericQueryOptions, ExtendedStatus } from './common';
import { CreateProviderIntegrationRequest, ProviderCapability } from './providers';
/**
 * App Integrations Types (Core System Level)
 * Used for system-level integrations like password reset email, system notifications, etc.
 */
export interface AppIntegrationQuery extends PaginationQuery {
    status?: ExtendedStatus;
    providerId?: string;
    isDefault?: boolean;
}
export interface AppIntegrationResponse {
    id: string;
    appId: string;
    providerId: string;
    name: string;
    config: Record<string, unknown>;
    status: 'active' | 'inactive' | 'error' | 'pending';
    isDefault: boolean;
    capabilities: string[];
    providerName: string;
    lastSyncAt?: string;
    syncInterval?: number;
    lastError?: string;
    createdAt: string;
    updatedAt: string;
}
export interface AppIntegrationListResponse extends ListResponse<AppIntegrationResponse> {
}
export interface AppIntegrationQueryOptions extends GenericQueryOptions<AppIntegrationQuery> {
}
export type CreateAppIntegrationTypedRequest = CreateProviderIntegrationRequest & {
    isDefault?: boolean;
};
export interface CreateAppIntegrationRequest {
    providerId: string;
    name: string;
    config: Record<string, unknown>;
    isDefault?: boolean;
}
export interface UpdateAppIntegrationRequest {
    name?: string;
    config?: Record<string, unknown>;
    status?: 'active' | 'inactive' | 'error' | 'pending';
    isDefault?: boolean;
    capabilities?: ProviderCapability[];
    lastSyncAt?: string;
    syncInterval?: number;
    lastError?: string;
}
export interface TestAppIntegrationRequest {
    testType: 'send_email' | 'send_message' | 'send_webhook';
    testData: Record<string, unknown>;
}
export interface ProviderDefinitionResponse {
    id: string;
    name: string;
    capabilities: string[];
    categories: string[];
    status: 'active' | 'inactive';
    configSchema: Record<string, unknown>;
    /**
     * Config schema for Direct API mode (config by ID, no OAuth signup flow).
     * Optional — only providers that support a non-Embedded-Signup app-level
     * config expose it (e.g. whatsapp-business, registering a WABA directly
     * as the official 2FA sender). Absent when the provider only supports
     * Embedded Signup / has no Direct API alternative.
     */
    directConfigSchema?: Record<string, unknown>;
}

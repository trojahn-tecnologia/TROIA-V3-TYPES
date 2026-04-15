import { PaginationQuery, ListResponse, GenericQueryOptions, ExtendedStatus } from './common';
import { CreateProviderIntegrationRequest } from './providers';
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
}

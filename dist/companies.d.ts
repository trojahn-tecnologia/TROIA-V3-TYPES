import { FullTenantDocument, ActiveStatus, Address, PaginationQuery, GenericQueryOptions, ListResponse } from "./common";
import type { DistributionConfig } from './distribution';
import type { TenantThemeOverrides } from './theme';
import type { CompanyCard, CompanyCardResponse, CreditBalance, CreditSubscription, CreditAlert, CreditInvoice } from './credits';
import type { UserResponse } from './user';
export type CompanyDocumentType = 'CPF' | 'CNPJ';
export interface Company extends FullTenantDocument {
    name: string;
    email: string;
    phone?: string;
    website?: string;
    logo?: string;
    document?: string;
    documentType?: CompanyDocumentType;
    status: ActiveStatus;
    defaultCountryCode?: string;
    /** IANA timezone (ex.: 'America/Sao_Paulo'). Default de exibição: America/Sao_Paulo. */
    timezone?: string;
    address: Address;
    defaultAssignmentConfig?: DistributionConfig;
    themeOverrides?: TenantThemeOverrides;
    cards: CompanyCard[];
    creditBalance: CreditBalance;
    creditSubscription?: CreditSubscription;
    creditAlerts: CreditAlert[];
    invoices: CreditInvoice[];
    qualityInsights?: {
        enabled: boolean;
        sampleRate: number;
    };
}
export interface CreateCompanyRequest {
    name: string;
    email: string;
    phone?: string;
    website?: string;
    address: Address;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
}
export interface UpdateCompanyRequest {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    logo?: string;
    document?: string;
    documentType?: CompanyDocumentType;
    status?: ActiveStatus;
    defaultCountryCode?: string;
    timezone?: string;
    address?: Partial<Address>;
    defaultAssignmentConfig?: DistributionConfig;
    themeOverrides?: TenantThemeOverrides;
}
export interface UpdateCompanyAssignmentConfigRequest {
    defaultAssignmentConfig: DistributionConfig;
}
export type CompanyStatus = ActiveStatus;
export interface CompanyQuery extends PaginationQuery {
    status?: ActiveStatus;
    name?: string;
    email?: string;
}
export interface CompanyResponse {
    id: string;
    name: string;
    email: string;
    phone?: string;
    website?: string;
    logo?: string;
    document?: string;
    documentType?: CompanyDocumentType;
    appId: string;
    status: ActiveStatus;
    defaultCountryCode?: string;
    timezone?: string;
    address: Address;
    defaultAssignmentConfig?: DistributionConfig;
    themeOverrides?: TenantThemeOverrides;
    cards: CompanyCardResponse[];
    creditBalance: CreditBalance;
    creditSubscription?: CreditSubscription;
    creditAlerts: CreditAlert[];
    invoices: CreditInvoice[];
    qualityInsights?: {
        enabled: boolean;
        sampleRate: number;
    };
    createdAt: string;
    updatedAt: string;
}
export interface CompanyListResponse extends ListResponse<CompanyResponse> {
}
export interface CompanyQueryOptions extends GenericQueryOptions<CompanyQuery> {
}
export interface CompanyRegistrationResponse {
    company: CompanyResponse;
    user: UserResponse;
}

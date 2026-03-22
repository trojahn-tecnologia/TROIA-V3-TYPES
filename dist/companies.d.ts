import { FullTenantDocument, ActiveStatus, Address, PaginationQuery, GenericQueryOptions, ListResponse } from "./common";
import { AssignmentConfig } from './assignment';
import type { TenantThemeOverrides } from './theme';
export interface Company extends FullTenantDocument {
    name: string;
    email: string;
    phone?: string;
    website?: string;
    logo?: string;
    status: ActiveStatus;
    defaultCountryCode?: string;
    address: Address;
    defaultAssignmentConfig?: AssignmentConfig;
    themeOverrides?: TenantThemeOverrides;
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
    status?: ActiveStatus;
    defaultCountryCode?: string;
    address?: Partial<Address>;
    defaultAssignmentConfig?: AssignmentConfig;
    themeOverrides?: TenantThemeOverrides;
}
export interface UpdateCompanyAssignmentConfigRequest {
    defaultAssignmentConfig: AssignmentConfig;
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
    appId: string;
    status: ActiveStatus;
    defaultCountryCode?: string;
    address: Address;
    defaultAssignmentConfig?: AssignmentConfig;
    themeOverrides?: TenantThemeOverrides;
    createdAt: string;
    updatedAt: string;
}
export interface CompanyListResponse extends ListResponse<CompanyResponse> {
}
export interface CompanyQueryOptions extends GenericQueryOptions<CompanyQuery> {
}
export interface CompanyRegistrationResponse {
    company: CompanyResponse;
    user: any;
}

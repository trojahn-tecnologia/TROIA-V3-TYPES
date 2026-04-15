import { ObjectId } from 'mongodb';
import { TenantAwareDocument, FullTenantDocument, ActiveStatus, Address, PaginationQuery, GenericQueryOptions, ListResponse } from "./common";
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
    sampleRate: number; // 0.0–1.0
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
  address?: Partial<Address>;
  defaultAssignmentConfig?: DistributionConfig;
  themeOverrides?: TenantThemeOverrides;
}

// Assignment configuration specific request
export interface UpdateCompanyAssignmentConfigRequest {
  defaultAssignmentConfig: DistributionConfig;
}

export type CompanyStatus = ActiveStatus;
// ============================================================
// COMPANY SPECIFIC QUERY & RESPONSE TYPES
// ============================================================

// Company query with specific filters
export interface CompanyQuery extends PaginationQuery {
  status?: ActiveStatus;
  name?: string;
  email?: string;
}

// Company response (same as Company for now, but prepared for future changes)
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

// Company list response using generic
export interface CompanyListResponse extends ListResponse<CompanyResponse> {}

// Company query options using generic
export interface CompanyQueryOptions extends GenericQueryOptions<CompanyQuery> {}

// Special response for company registration (company + user)
export interface CompanyRegistrationResponse {
  company: CompanyResponse;
  user: UserResponse;
}

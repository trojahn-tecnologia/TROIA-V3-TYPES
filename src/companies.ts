import { ObjectId } from 'mongodb';
import { TenantAwareDocument, FullTenantDocument, ActiveStatus, Address, PaginationQuery, GenericQueryOptions, ListResponse } from "./common";
import { AssignmentConfig } from './assignment';
import type { TenantThemeOverrides } from './theme';
import type { CompanyCard, CompanyCardResponse, CreditBalance, CreditSubscription, CreditAlert, CreditInvoice } from './credits';

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
  cards: CompanyCard[];
  creditBalance: CreditBalance;
  creditSubscription?: CreditSubscription;
  creditAlerts: CreditAlert[];
  invoices: CreditInvoice[];
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

// Assignment configuration specific request
export interface UpdateCompanyAssignmentConfigRequest {
  defaultAssignmentConfig: AssignmentConfig;
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
  appId: string;
  status: ActiveStatus;
  defaultCountryCode?: string;
  address: Address;
  defaultAssignmentConfig?: AssignmentConfig;
  themeOverrides?: TenantThemeOverrides;
  cards: CompanyCardResponse[];
  creditBalance: CreditBalance;
  creditSubscription?: CreditSubscription;
  creditAlerts: CreditAlert[];
  invoices: CreditInvoice[];
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
  user: any; // Will be UserResponse when we import it
}

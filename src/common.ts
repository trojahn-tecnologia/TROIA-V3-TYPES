import { ObjectId } from 'mongodb';

// ============================================================
// BASE DOCUMENT TYPES
// ============================================================

export interface BaseDocument {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AppAwareDocument extends BaseDocument {
  appId: ObjectId;
}

export interface TenantAwareDocument extends BaseDocument {
  appId: ObjectId;
  companyId: ObjectId;
}

// Complete base document with all patterns
export interface FullBaseDocument extends BaseDocument, SoftDeletable {}

// Multi-tenant aware document with full audit trail
export interface FullTenantDocument extends TenantAwareDocument, SoftDeletable {}

// ============================================================
// COMMON PATTERNS
// ============================================================

// Soft delete pattern
export interface SoftDeletable {
  deletedAt?: Date;
}

// Audit pattern
export interface Auditable {
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================
// ADDRESS TYPE (GLOBAL)
// ============================================================

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: unknown[];
}

// ============================================================
// QUERY & PAGINATION TYPES
// ============================================================

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: unknown;
}

export interface QueryOptions {
  filters?: FilterOptions;
  sort?: SortOptions;
  pagination?: PaginationOptions;
}

export interface PaginationQuery {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

export interface SearchQuery extends PaginationQuery {
  filters?: Record<string, unknown>;
}

// ============================================================
// FORM TYPES
// ============================================================

export interface FormFieldError {
  message: string;
}

export interface FormErrors {
  [key: string]: FormFieldError | undefined;
}

export interface FormState {
  isSubmitting: boolean;
  isDirty: boolean;
  errors: FormErrors;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

// ============================================================
// STATUS TYPES
// ============================================================

export type EntityStatus = 'active' | 'inactive' | 'blocked';
export type ActiveStatus = 'active' | 'inactive';
export type ExtendedStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'error';

// ============================================================
// UTILITY TYPES
// ============================================================

export interface EntityParams {
}

export interface RequestContext {
  appId: ObjectId;
  companyId?: ObjectId;
  userId?: ObjectId;
}
// ============================================================
// GENERIC QUERY TYPES
// ============================================================

export interface GenericQueryOptions<T> extends PaginationQuery {
  filters?: Partial<T>;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// MongoDB filter type is intentionally loose to interop with native driver's FilterOperators.
// Generic T is retained for backwards compatibility but not enforced.
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export type MongoFilter<T = Record<string, any>> = Record<string, any>;

export interface MongoSortConfig {
  [key: string]: 1 | -1;
}

export interface MongoQueryOptions {
  filter: MongoFilter;
  sort?: MongoSortConfig;
  skip?: number;
  limit?: number;
  projection?: Record<string, 0 | 1>;
}

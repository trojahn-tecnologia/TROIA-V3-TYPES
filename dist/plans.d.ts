import { AppAwareDocument, ActiveStatus, PaginationQuery, GenericQueryOptions, ListResponse } from './common';
export interface Plan extends AppAwareDocument {
    name: string;
    description: string;
    creditsPerCycle: number;
    price: {
        monthly: number;
        yearly: number;
        currency: string;
    };
    features?: string[];
    status: ActiveStatus;
}
export interface PlanQuery extends PaginationQuery {
    status?: ActiveStatus;
    name?: string;
    priceRange?: {
        min?: number;
        max?: number;
    };
}
export interface PlanResponse {
    id: string;
    name: string;
    description: string;
    creditsPerCycle: number;
    price: {
        monthly: number;
        yearly: number;
        currency: string;
    };
    features?: string[];
    appId: string;
    status: ActiveStatus;
    createdAt: string;
    updatedAt: string;
}
export interface PlanListResponse extends ListResponse<PlanResponse> {
}
export interface PlanQueryOptions extends GenericQueryOptions<PlanQuery> {
}
export interface CreatePlanRequest {
    name: string;
    description: string;
    creditsPerCycle: number;
    price: {
        monthly: number;
        yearly: number;
        currency: string;
    };
    features?: string[];
}
export interface UpdatePlanRequest {
    name?: string;
    description?: string;
    creditsPerCycle?: number;
    price?: {
        monthly?: number;
        yearly?: number;
        currency?: string;
    };
    features?: string[];
    status?: ActiveStatus;
}

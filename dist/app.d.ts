import { FullBaseDocument, ActiveStatus, PaginationQuery, GenericQueryOptions, ListResponse } from "./common";
import { TenantThemeOverrides, BaseThemeId } from './theme';
export interface App extends FullBaseDocument {
    name: string;
    logo: string;
    status: ActiveStatus;
    baseThemeId?: BaseThemeId;
    themeOverrides?: TenantThemeOverrides;
    domains: string[];
    modules: string[];
    backendUrl: string;
    websiteUrl?: string;
    widgetUrl?: string;
    support?: AppSupport;
}
export interface AppSupportWidget {
    channelId: string;
    token: string;
}
export interface AppSupport {
    widget?: AppSupportWidget;
}
export interface CreateAppRequest {
    name: string;
    logo: string;
    baseThemeId?: BaseThemeId;
    themeOverrides?: TenantThemeOverrides;
    domains: string[];
    modules: string[];
    backendUrl: string;
    websiteUrl?: string;
    widgetUrl?: string;
    support?: AppSupport;
}
export interface UpdateAppRequest {
    name?: string;
    logo?: string;
    status?: ActiveStatus;
    baseThemeId?: BaseThemeId;
    themeOverrides?: TenantThemeOverrides;
    domains?: string[];
    modules?: string[];
    backendUrl?: string;
    websiteUrl?: string;
    widgetUrl?: string;
    support?: AppSupport;
}
export type AppStatus = ActiveStatus;
export interface AppQuery extends PaginationQuery {
    status?: ActiveStatus;
    name?: string;
    domains?: string[];
}
export interface AppResponse {
    id: string;
    name: string;
    logo: string;
    status: ActiveStatus;
    baseThemeId?: BaseThemeId;
    themeOverrides?: TenantThemeOverrides;
    domains: string[];
    modules: string[];
    backendUrl: string;
    websiteUrl?: string;
    widgetUrl?: string;
    support?: AppSupport;
    createdAt: string;
    updatedAt: string;
}
export interface AppListResponse extends ListResponse<AppResponse> {
}
export interface AppQueryOptions extends GenericQueryOptions<AppQuery> {
}

import { TenantAwareDocument, PaginationQuery, ListResponse } from './common';
export type WebsiteFieldType = 'text' | 'textarea' | 'richtext' | 'number' | 'boolean' | 'select' | 'multiselect' | 'color' | 'image' | 'images' | 'url' | 'reference' | 'funnelStep' | 'list' | 'object';
export interface ComponentFieldDefinition {
    name: string;
    label: string;
    type: WebsiteFieldType;
    description?: string;
    defaultValue?: unknown;
    required?: boolean;
    placeholder?: string;
    group?: string;
    order?: number;
    validation?: {
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
    };
    options?: Array<{
        label: string;
        value: string | number;
    }>;
    referenceConfig?: {
        entity: 'database' | 'funnelStep' | 'team' | 'user';
        multiple?: boolean;
        displayField?: string;
    };
    subFields?: ComponentFieldDefinition[];
    showIf?: {
        field: string;
        operator: 'eq' | 'neq' | 'exists';
        value: unknown;
    };
}
export type BlockCategory = 'hero' | 'content' | 'listing' | 'form' | 'navigation' | 'social' | 'media' | 'integration' | 'footer';
export interface BlockDefinition {
    id: string;
    name: string;
    description: string;
    category: BlockCategory;
    icon: string;
    configSchema: ComponentFieldDefinition[];
    defaultConfig: Record<string, unknown>;
    maxInstances?: number;
    /** Região de layout na página de imóvel: topo full-width / coluna principal / sidebar sticky / rodapé full-width. Ausente = 'main'. */
    region?: 'top' | 'main' | 'sidebar' | 'bottom';
    version: string;
}
export interface BlockInstance {
    instanceId: string;
    blockId: string;
    config: Record<string, unknown>;
    order: number;
    visible: boolean;
    /**
     * Espelhamento de bloco: pageId da página de origem. Quando setado, o config
     * deste bloco é sobreposto (no read, via WebsitesService.resolveMirrors) pelo
     * config do bloco de mesmo blockId na página de origem. `visible` e `order`
     * continuam locais. 1 nível só — origem que também espelha NÃO é seguida.
     */
    mirrorOf?: string;
    /**
     * true quando o bloco foi adicionado ou duplicado pelo usuário no customizer
     * (pode ser removido). Ausente/false = bloco originado do template — apenas
     * ocultável (visible), nunca deletável. Sem flag em docs antigos = template.
     */
    addedByUser?: boolean;
}
export type TemplateSegment = 'real_estate' | 'automotive' | 'ecommerce' | 'portfolio' | 'blog' | 'landing_page';
export interface TemplatePageDefinition {
    id: string;
    name: string;
    defaultRoute: string;
    icon: string;
    defaultBlocks: BlockInstance[];
    requiredBlocks?: string[];
    removable?: boolean;
    /** Página de rota dinâmica por item (ex: detalhe do imóvel). */
    isDynamic?: boolean;
    /** Padrão de rota com placeholder, ex: '/imoveis/:slug'. Só para isDynamic. */
    routePattern?: string;
}
export interface TemplateModel {
    id: string;
    name: string;
    description: string;
    version: string;
    segment: TemplateSegment;
    tags: string[];
    previews: {
        thumbnail: string;
        desktop: string;
        mobile: string;
    };
    blocks: BlockDefinition[];
    pages: TemplatePageDefinition[];
    globalConfigSchema: ComponentFieldDefinition[];
    defaultGlobalConfig: Record<string, unknown>;
    fonts?: Array<{
        family: string;
        weights: number[];
        source: 'google' | 'custom';
    }>;
}
/**
 * Posição da marca d'água aplicada às fotos dos imóveis.
 * `tiled` = logo repetida em diagonal (mais difícil de cortar).
 */
export type WatermarkPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center' | 'top-right' | 'top-left' | 'tiled';
export interface Website extends TenantAwareDocument {
    name: string;
    modelId: string;
    domains: string[];
    databaseIds?: string[];
    globalConfig: Record<string, unknown>;
    pages: WebsitePage[];
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    deletedAt?: Date;
}
export interface WebsitePage {
    pageId: string;
    seoConfig?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };
    blocks: BlockInstance[];
}
export interface WebsiteResponse extends Omit<Website, '_id'> {
    id: string;
}
export interface WebsiteListResponse extends ListResponse<WebsiteResponse> {
}
export interface WebsitePublicData {
    /** _id do website (string). Não é tenant id; já usado no subdomínio de preview. */
    id: string;
    modelId: string;
    globalConfig: Record<string, unknown>;
    pages: WebsitePage[];
    /** true quando servido via host de preview ({websiteId}.{app.renderUrl}) */
    isPreview?: boolean;
    /**
     * Endpoint + token para os formulários públicos criarem leads.
     * `url` = app.apiUrl (base da public-api do tenant); `key` = token cru da
     * API key 'Websites' (auto-provisionada). Omitido quando app.apiUrl não setado.
     */
    leadsApi?: {
        url: string;
        key: string;
    };
}
export interface CreateWebsiteRequest {
    name: string;
    modelId: string;
    domains?: string[];
    databaseIds?: string[];
    globalConfig?: Record<string, unknown>;
    pages?: WebsitePage[];
}
export interface UpdateWebsiteRequest {
    name?: string;
    domains?: string[];
    databaseIds?: string[];
    globalConfig?: Record<string, unknown>;
    pages?: WebsitePage[];
    status?: 'draft' | 'published' | 'archived';
}
export interface WebsiteQuery extends PaginationQuery {
    status?: string;
    modelId?: string;
}

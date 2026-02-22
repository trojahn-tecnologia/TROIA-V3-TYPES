import { ObjectId } from 'mongodb';
import { TenantAwareDocument, PaginationQuery, ListResponse } from './common';

// ============================================================
// FIELD SYSTEM - Dynamic form generation
// ============================================================

export type WebsiteFieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'color'
  | 'image'
  | 'images'
  | 'url'
  | 'reference'
  | 'list'
  | 'object';

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

  options?: Array<{ label: string; value: string | number }>;

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

// ============================================================
// BLOCK SYSTEM - Configurable page components
// ============================================================

export type BlockCategory =
  | 'hero'
  | 'content'
  | 'listing'
  | 'form'
  | 'navigation'
  | 'social'
  | 'media'
  | 'integration'
  | 'footer';

export interface BlockDefinition {
  id: string;
  name: string;
  description: string;
  category: BlockCategory;
  icon: string;
  configSchema: ComponentFieldDefinition[];
  defaultConfig: Record<string, unknown>;
  maxInstances?: number;
  version: string;
}

export interface BlockInstance {
  instanceId: string;
  blockId: string;
  config: Record<string, unknown>;
  order: number;
  visible: boolean;
}

// ============================================================
// MODEL SYSTEM - Template manifests
// ============================================================

export type TemplateSegment =
  | 'real_estate'
  | 'automotive'
  | 'ecommerce'
  | 'portfolio'
  | 'blog'
  | 'landing_page';

export interface TemplatePageDefinition {
  id: string;
  name: string;
  defaultRoute: string;
  icon: string;
  defaultBlocks: BlockInstance[];
  requiredBlocks?: string[];
  removable?: boolean;
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

// ============================================================
// WEBSITE ENTITY - Stored in database
// ============================================================

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

// ============================================================
// RESPONSE TYPES
// ============================================================

export interface WebsiteResponse extends Omit<Website, '_id'> {
  id: string;
}

export interface WebsiteListResponse extends ListResponse<WebsiteResponse> {}

// ============================================================
// PUBLIC API
// ============================================================

export interface WebsitePublicData {
  modelId: string;
  globalConfig: Record<string, unknown>;
  pages: WebsitePage[];
}

// ============================================================
// REQUEST TYPES
// ============================================================

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

// ============================================================
// QUERY TYPES
// ============================================================

export interface WebsiteQuery extends PaginationQuery {
  status?: string;
  modelId?: string;
}

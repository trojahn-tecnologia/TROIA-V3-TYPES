/**
 * 🗄️ DATABASES MODULE - Type Definitions
 *
 * Purpose: Segregate content types/sources for manipulation by other modules
 * and use as knowledge base for AI agents
 *
 * Architecture:
 * - Single collection 'databases-documents' with polymorphic data based on 'type'
 * - Relationship: databases ↔ databases-documents via databaseId
 * - Multi-opportunity business model: Items can have multiple simultaneous business opportunities
 */

import { ActorType, PaginationQuery, ListResponse } from './common';

// ============================================================================
// BUSINESS OPPORTUNITY TYPES (Core Reusable Types)
// ============================================================================

export enum BusinessOpportunityType {
  SALE = 'sale',
  RENT = 'rent',
  SEASONAL_RENT = 'seasonal_rent',
  DAILY_RENT = 'daily_rent',
  LEASE = 'lease',
  EXCHANGE = 'exchange',
  DONATION = 'donation',
  AUCTION = 'auction'
}

export enum OpportunityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESERVED = 'reserved',
  IN_NEGOTIATION = 'in_negotiation',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Business Opportunity - Reusable across all database types
 *
 * Enables items to have multiple simultaneous business opportunities
 * Example: Property available for sale (R$850k) + rent (R$3.5k/month) + seasonal_rent (R$500/day)
 */
export interface BusinessOpportunity {
  /** Unique identifier for this opportunity */
  id: string;

  /** Type of business opportunity */
  type: BusinessOpportunityType;

  /** Current status of this opportunity (independent from item status) */
  status: OpportunityStatus;

  /** Pricing configuration */
  pricing: {
    /** Amount in currency unit */
    amount: number;

    /** Currency code (default: BRL) */
    currency: string;

    /** Billing period for recurring opportunities */
    period?: 'day' | 'month' | 'year';

    /** How price is calculated */
    unitType?: 'total' | 'per_sqm' | 'per_unit';
  };

  /** Business conditions and terms */
  conditions?: {
    /** Price is negotiable */
    negotiable?: boolean;

    /** Accepts exchange/trade */
    acceptsExchange?: boolean;

    /** Details about what can be exchanged */
    exchangeDetails?: string;

    /** Minimum rental/lease period (in days) */
    minPeriod?: number;

    /** Maximum rental/lease period (in days) */
    maxPeriod?: number;

    /** Security deposit amount */
    deposit?: number;

    /** Advance payment (months) */
    advance?: number;

    /** Down payment for sales */
    downPayment?: number;

    /** Installment options */
    installments?: {
      available: boolean;
      maxInstallments?: number;
      interestRate?: number;
    };

    /** Discount configuration */
    discount?: {
      type: 'percentage' | 'fixed';
      value: number;
      conditions?: string;
    };
  };

  /** Temporal availability */
  availability?: {
    /** Available from date */
    from?: string;

    /** Available until date */
    to?: string;

    /** Specific available dates (for seasonal) */
    specificDates?: string[];

    /** Immediately available */
    immediateAvailability?: boolean;
  };

  /** Additional costs (IPTU, condo fees, insurance, etc.) */
  additionalCosts?: Array<{
    name: string;
    amount: number;
    frequency?: 'monthly' | 'yearly' | 'one_time';
    includedInPrice?: boolean;
  }>;

  /** Private notes (internal use) */
  notes?: string;

  /** Public notes (shown to customers) */
  publicNotes?: string;

  /** Opportunity creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;

  /** Completion timestamp (when status became 'completed') */
  completedAt?: string;
}

// ============================================================================
// DATABASE TYPES
// ============================================================================

export enum DatabaseType {
  PROPERTIES = 'properties',
  VEHICLES = 'vehicles',
  PRODUCTS = 'products',
  SERVICES = 'services',
  DOCUMENTS = 'documents'
}

export enum DatabaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

// ============================================================================
// PROPERTY DATABASE TYPE
// ============================================================================

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  FARM = 'farm',
  WAREHOUSE = 'warehouse',
  OFFICE = 'office',
  STUDIO = 'studio',
  PENTHOUSE = 'penthouse',
  TOWNHOUSE = 'townhouse'
}

export enum PropertyItemStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  UNDER_CONSTRUCTION = 'under_construction',
  RESERVED = 'reserved',
  ARCHIVED = 'archived'
}

export interface PropertyAddress {
  street: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface DatabasePropertyData {
  /** Property title */
  title: string;

  /**
   * Endereço da ficha na URL pública do site.
   *
   * Gerado pelo backend na criação quando chega vazio
   * (`documents-repository.ts:115`) e resolvido depois por um `findOne` SEM
   * base e SEM ordenação (`documents-repository.ts:953`) — por isso a CÓPIA de
   * um registro nasce sem slug: dois registros com o mesmo slug fazem o site
   * servir um dos dois por sorteio.
   *
   * A tela nunca manda este campo. Ele existe no tipo porque o dado existe no
   * banco e porque quem apaga um campo precisa que o tipo diga que ele existe.
   */
  slug?: string;

  /** Detailed description */
  description: string;

  /**
   * Descrição interna — visível apenas para a equipe no painel.
   * Removida de TODAS as superfícies públicas (site público + agente de IA,
   * incluindo RAG) via applyPropertyPublicRedaction no backend.
   */
  internalDescription?: string;

  /** Internal reference code */
  reference?: string;

  /** Type of property */
  propertyType: PropertyType;

  /** Full address */
  address: PropertyAddress;

  /**
   * Exibir o endereço preciso (rua/número/CEP/coordenadas/mapa) nas superfícies
   * públicas (site + agente). Ausente/false = Privado (só bairro/cidade/estado).
   * No sync é definido só na inserção; depois só o toggle manual altera.
   */
  showAddress?: boolean;

  /** Property features */
  features: {
    bedrooms?: number;
    bathrooms?: number;
    suites?: number;
    parkingSpaces?: number;
    totalArea?: number;
    builtArea?: number;
    privateArea?: number;
    floors?: number;
    units?: number;
  };

  /** Amenities and characteristics */
  amenities?: string[];

  /** Construction details */
  construction?: {
    year?: number;
    style?: string;
    condition?: 'new' | 'excellent' | 'good' | 'needs_renovation' | 'under_renovation';
  };

  /** 🔑 MULTI-OPPORTUNITY MODEL */
  opportunities: BusinessOpportunity[];

  /** Overall item status (independent from opportunity status) */
  itemStatus: PropertyItemStatus;

  /** Media files */
  media?: {
    photos?: string[];
    videos?: string[];
    virtualTour?: string;
    floorPlan?: string[];
  };

  /** External system ID (for integration sync) */
  externalId?: string;

  /** External system metadata */
  externalMetadata?: Record<string, unknown>;

  /** Tags for categorization */
  tags?: string[];

  /** Custom fields */
  customFields?: Record<string, unknown>;
}

// ============================================================================
// VEHICLE DATABASE TYPE
// ============================================================================

export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  TRUCK = 'truck',
  SUV = 'suv',
  VAN = 'van',
  BUS = 'bus',
  BOAT = 'boat',
  JET_SKI = 'jet_ski',
  BICYCLE = 'bicycle'
}

export enum FuelType {
  GASOLINE = 'gasoline',
  ETHANOL = 'ethanol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  FLEX = 'flex'
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  SEMI_AUTOMATIC = 'semi_automatic',
  CVT = 'cvt'
}

export enum VehicleCondition {
  NEW = 'new',
  USED = 'used',
  CERTIFIED = 'certified'
}

export enum VehicleItemStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  IN_MAINTENANCE = 'in_maintenance',
  RESERVED = 'reserved',
  ARCHIVED = 'archived'
}

export interface DatabaseVehicleData {
  /** Vehicle brand */
  brand: string;

  /** Endereço da ficha na URL pública. Gerado pelo backend — ver `DatabasePropertyData.slug`. */
  slug?: string;

  /** Vehicle model */
  model: string;

  /** Manufacturing year */
  year: number;

  /** Model year (can be different from manufacturing year) */
  modelYear?: number;

  /** Type of vehicle */
  vehicleType: VehicleType;

  /** Engine specifications */
  engine: {
    fuelType: FuelType;
    transmission: TransmissionType;
    engineSize?: string;
    power?: number;
    cylinders?: number;
  };

  /** Mileage in kilometers */
  mileage?: number;

  /** Vehicle condition */
  condition: VehicleCondition;

  /** Color */
  color?: string;

  /** License plate */
  licensePlate?: string;

  /** Chassis number (VIN) */
  chassisNumber?: string;

  /** Features and accessories */
  features?: string[];

  /** 🔑 MULTI-OPPORTUNITY MODEL */
  opportunities: BusinessOpportunity[];

  /** Overall item status */
  itemStatus: VehicleItemStatus;

  /** Media files */
  media?: {
    photos?: string[];
    videos?: string[];
  };

  /** External system ID */
  externalId?: string;

  /** External system metadata */
  externalMetadata?: Record<string, unknown>;

  /** Tags */
  tags?: string[];

  /** Custom fields */
  customFields?: Record<string, unknown>;
}

// ============================================================================
// PRODUCT DATABASE TYPE
// ============================================================================

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  FURNITURE = 'furniture',
  CLOTHING = 'clothing',
  FOOD = 'food',
  BOOKS = 'books',
  TOYS = 'toys',
  SPORTS = 'sports',
  BEAUTY = 'beauty',
  AUTOMOTIVE = 'automotive',
  HOME_GARDEN = 'home_garden',
  OTHER = 'other'
}

export enum ProductItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'outofstock',
  DISCONTINUED = 'discontinued',
  ARCHIVED = 'archived'
}

/** Reusable dimensions type for product and variations */
export interface ProductDimensions {
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  unit: 'cm' | 'inch' | 'kg' | 'lb';
}

/** Product variation with full inventory and media support */
export interface ProductVariation {
  /** Unique variation ID */
  id: string;
  /** Display name (e.g. "P / Vermelho") */
  name: string;
  /** Attribute key-value pairs (e.g. { cor: 'Vermelho', tamanho: 'P' }) */
  attributes: Record<string, string>;
  /** Variation-specific SKU */
  sku?: string;
  /** Barcode (EAN/UPC) */
  barcode?: string;
  /** Stock quantity - REQUIRED per variation */
  stock: number;
  /** Override product dimensions for this variation */
  dimensions?: ProductDimensions;
  /** Variation-specific photos */
  media?: {
    photos?: string[];
  };
  /** Independent status per variation */
  itemStatus?: ProductItemStatus;
  /** Override base opportunities with variation-specific pricing */
  opportunities?: BusinessOpportunity[];
}

export interface DatabaseProductData {
  /** Product name */
  name: string;

  /** Endereço da ficha na URL pública. Gerado pelo backend — ver `DatabasePropertyData.slug`. */
  slug?: string;

  /** Detailed description */
  description: string;

  /** Base SKU (optional if product has variations) */
  sku?: string;

  /** Category */
  category: ProductCategory;

  /** Brand/Manufacturer */
  brand?: string;

  /** Inventory configuration (product-level settings) */
  inventory: {
    /** Whether to track inventory for this product */
    trackInventory: boolean;
    /** Unit of measurement (global for product) */
    stockUnit: 'unit' | 'kg' | 'liter' | 'meter' | 'box' | 'pack';
    /** Alert threshold for low stock */
    lowStockThreshold?: number;
    /** Stock quantity - ONLY for simple products (no variations) */
    stock?: number;
  };

  /** Default physical dimensions (can be overridden per variation) */
  dimensions?: ProductDimensions;

  /** Base business opportunities (can be overridden per variation) */
  opportunities: BusinessOpportunity[];

  /** Product variations (colors, sizes, etc.) */
  variations?: ProductVariation[];

  /** Overall item status */
  itemStatus: ProductItemStatus;

  /** Media files */
  media?: {
    photos?: string[];
    videos?: string[];
  };

  /** External system ID */
  externalId?: string;

  /** External system metadata */
  externalMetadata?: Record<string, unknown>;

  /** Tags */
  tags?: string[];

  /** Custom fields */
  customFields?: Record<string, unknown>;
}

// ============================================================================
// SERVICE DATABASE TYPE
// ============================================================================

export enum ServiceType {
  CONSULTING = 'consulting',
  MAINTENANCE = 'maintenance',
  INSTALLATION = 'installation',
  REPAIR = 'repair',
  CLEANING = 'cleaning',
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  MARKETING = 'marketing',
  EDUCATION = 'education',
  HEALTH = 'health',
  LEGAL = 'legal',
  FINANCIAL = 'financial',
  OTHER = 'other'
}

export enum ServiceDeliveryMethod {
  IN_PERSON = 'in-person',
  REMOTE = 'remote',
  HYBRID = 'hybrid'
}

export enum ServiceItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived'
}

export interface DatabaseServiceData {
  /** Service name */
  name: string;

  /** Endereço da ficha na URL pública. Gerado pelo backend — ver `DatabasePropertyData.slug`. */
  slug?: string;

  /** Detailed description */
  description: string;

  /** Type of service */
  serviceType: ServiceType;

  /** How service is delivered */
  deliveryMethod: ServiceDeliveryMethod;

  /** Estimated duration */
  duration?: {
    value: number;
    unit: 'hour' | 'day' | 'week' | 'month';
  };

  /** Service area (cities, regions) */
  serviceArea?: string[];

  /** 🔑 MULTI-OPPORTUNITY MODEL */
  opportunities: BusinessOpportunity[];

  /** Requirements from customer */
  requirements?: string[];

  /** Deliverables included */
  deliverables?: string[];

  /** Overall item status */
  itemStatus: ServiceItemStatus;

  /** Media files */
  media?: {
    photos?: string[];
    videos?: string[];
    portfolio?: string[];
  };

  /** External system ID */
  externalId?: string;

  /** External system metadata */
  externalMetadata?: Record<string, unknown>;

  /** Tags */
  tags?: string[];

  /** Custom fields */
  customFields?: Record<string, unknown>;
}

// ============================================================================
// DOCUMENT DATABASE TYPE (Knowledge Base for AI Agents)
// ============================================================================

export enum DocumentCategory {
  ARTICLE = 'article',
  MANUAL = 'manual',
  FAQ = 'faq',
  POLICY = 'policy',
  GUIDE = 'guide',
  TUTORIAL = 'tutorial',
  REPORT = 'report',
  WHITEPAPER = 'whitepaper',
  CASE_STUDY = 'case_study',
  OTHER = 'other'
}

export enum DocumentItemStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

/**
 * Tipo da mídia principal de um documento (aula do Academy, post do blog).
 * `video`/`audio` = arquivo tocado por <video>/<audio>; `frame` = URL de embed
 * (YouTube, Vimeo, Loom...) montada em <iframe> pelo site. Tupla exportada para
 * o Zod do backend derivar o enum (CLAUDE.md NUNCA #94: nunca lista manual).
 */
export const DOCUMENT_MEDIA_TYPES = ['video', 'audio', 'frame'] as const;
export type DocumentMediaType = (typeof DOCUMENT_MEDIA_TYPES)[number];

export interface DatabaseDocumentData {
  /** Document title */
  title: string;

  /**
   * Endereço do artigo na URL pública do site (blog). Gerado pelo backend a
   * partir do título (`documents-repository.ts:58-64`) — ver
   * `DatabasePropertyData.slug`.
   */
  slug?: string;

  /** Full content (markdown supported) */
  content: string;

  /** Short summary/excerpt */
  summary?: string;

  /** Document category */
  category: DocumentCategory;

  /** Author */
  author?: string;

  /** Keywords for search */
  keywords?: string[];

  /** Language code (e.g., 'pt-BR', 'en-US') */
  language?: string;

  /** Vector embeddings for AI semantic search */
  embeddings?: number[];

  /** Related document IDs */
  relatedDocuments?: string[];

  /** Overall item status */
  itemStatus: DocumentItemStatus;

  /** Attachments */
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;

  /** Tipo da mídia principal. Exige `mediaUrl`. */
  mediaType?: DocumentMediaType;

  /** URL https do arquivo (video/audio) ou do embed (frame). Exige `mediaType`. */
  mediaUrl?: string;

  /** Capa (URL https). Substitui a heurística "primeiro anexo de imagem" do blog. */
  coverImage?: string;

  /** Trilha/curso. Texto livre; agrupa as fileiras da home do Academy. */
  series?: string;

  /** Posição da aula dentro da trilha (1, 2, 3...). */
  seriesOrder?: number;

  /** Duração em segundos. O formulário preenche ao carregar o vídeo/áudio. */
  duration?: number;

  /** External system ID */
  externalId?: string;

  /** External system metadata */
  externalMetadata?: Record<string, unknown>;

  /** Tags */
  tags?: string[];

  /** Custom fields */
  customFields?: Record<string, unknown>;
}

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

/**
 * Sync configuration for database integration
 */
export interface DatabaseSyncConfig {
  /** Enable/disable sync */
  enabled: boolean;

  /** Sync direction */
  direction: 'pull' | 'push' | 'bidirectional';

  /** Sync frequency in minutes */
  frequency: number;

  /** Last sync timestamp */
  lastSyncAt?: string;

  /** Next scheduled sync */
  nextSyncAt?: string;

  /** Conflict resolution strategy */
  conflictResolution?: 'external_wins' | 'local_wins' | 'manual_review';

  /** Auto-sync on create/update */
  autoSync?: boolean;
}

/**
 * Database configuration document
 */
export interface Database {
  _id: string;
  appId: string;
  companyId: string;

  /** Database name (user-defined) */
  name: string;

  /** Database type */
  type: DatabaseType;

  /** Description */
  description?: string;

  /** Database status */
  status: DatabaseStatus;

  /** Integration ID (if using external system) */
  integrationId?: string;

  /** Sync configuration (if integration enabled) */
  syncConfig?: DatabaseSyncConfig;

  /** Total documents count (cached) */
  totalDocuments?: number;

  /** Tags */
  tags?: string[];

  /** Custom settings */
  settings?: Record<string, unknown>;

  /** Domains associated with this database */
  domains?: string[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface DatabaseResponse extends Omit<Database, '_id' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  id: string;
  appId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// ============================================================================
// DATABASE DOCUMENT (Polymorphic Data Container)
// ============================================================================

/**
 * Polymorphic document - data structure varies based on 'type' field
 */
/**
 * Database Provider Sync Status
 *
 * Estados possíveis de sincronização com provider externo
 */
export type DatabaseProviderSyncStatus =
  | 'pending'   // Aguardando sincronização
  | 'synced'    // Sincronizado com sucesso
  | 'failed';   // Falha na sincronização

/**
 * Database Provider Sync Entry
 *
 * Registro de sincronização com um provider específico
 * Permite múltiplos providers sincronizando o mesmo documento
 */
export interface DatabaseProviderSyncEntry {
  integrationId: string;                  // ID da company-integration
  providerId: string;                     // ID do provider (database-jetimob, database-vista, etc.)
  providerDocumentId: string;             // ID do documento no sistema externo
  syncStatus: DatabaseProviderSyncStatus;
  lastSyncAt: string;                     // ISO date string
  syncError?: string;                     // Mensagem de erro se syncStatus === 'failed'
}

/** Variante da ficha de imóvel em PDF. */
export type PropertyPdfVariant = 'client' | 'internal';

/**
 * Slot de PDF exportado (ficha de imóvel) — cache por hash de conteúdo.
 * `generatedAt` é string ISO (mesmo precedente de providerSync.lastSyncAt).
 */
export interface DatabaseDocumentPdfExportInfo {
  /** URL S3. Variante client: pública; internal: objeto privado (download só via endpoint autenticado). */
  url: string;
  /** Key S3 para GetObject. */
  key: string;
  /** sha256 do payload canônico (imóvel + empresa + variante + versão do template). */
  sourceHash: string;
  /** ISO 8601. */
  generatedAt: string;
  sizeBytes?: number;
}

export interface DatabaseDocumentPdfExports {
  client?: DatabaseDocumentPdfExportInfo;
  internal?: DatabaseDocumentPdfExportInfo;
}

export interface DatabaseDocument<T = Record<string, unknown>> {
  _id: string;
  appId: string;
  companyId: string;

  /** Parent database ID */
  databaseId: string;

  /** Document type (determines data structure) */
  type: DatabaseType;

  /** Polymorphic data (validated based on type) */
  data: T;

  /** Document metadata */
  metadata?: {
    createdBy?: string;
    /**
     * De que coleção é o id em `createdBy`. Ver `CreatorStamp` em `common.ts`.
     * Ausente = documento anterior a 2026-08-30.
     */
    createdByType?: ActorType;
    updatedBy?: string;
    source?: 'manual' | 'integration' | 'import' | 'api';
    lastSyncedAt?: Date;
  };

  /** Provider sync tracking (para multi-provider support) */
  providerSync?: DatabaseProviderSyncEntry[];

  /**
   * PDFs exportados da ficha (só imóveis hoje). Vive no ENVELOPE de propósito:
   * o sync de integração sobrescreve `data` inteiro a cada ciclo — qualquer
   * cache dentro de `data` seria apagado. Escrito apenas pelo backend
   * (não settável via API de create/update).
   */
  pdfExports?: DatabaseDocumentPdfExports;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface DatabaseDocumentResponse<T = Record<string, unknown>> extends Omit<DatabaseDocument<T>, '_id' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  id: string;
  appId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateDatabaseRequest {
  name: string;
  type: DatabaseType;
  description?: string;
  tags?: string[];
  settings?: Record<string, unknown>;

  /** Optional integration setup */
  useIntegration?: boolean;
  providerId?: string;
  integrationConfig?: Record<string, unknown>;
  integrationCredentials?: Record<string, unknown>;

  /** Sync configuration */
  syncConfig?: Omit<DatabaseSyncConfig, 'lastSyncAt' | 'nextSyncAt'>;
}

export interface UpdateDatabaseRequest {
  name?: string;
  description?: string;
  status?: DatabaseStatus;
  tags?: string[];
  settings?: Record<string, unknown>;
  syncConfig?: Partial<DatabaseSyncConfig>;
  domains?: string[];
}

export interface CreateDatabaseDocumentRequest<T = Record<string, unknown>> {
  databaseId: string;
  type: DatabaseType;
  data: T;
  metadata?: {
    source?: 'manual' | 'integration' | 'import' | 'api';
  };
}

export interface UpdateDatabaseDocumentRequest<T = Record<string, unknown>> {
  data?: Partial<T>;
  metadata?: {
    source?: 'manual' | 'integration' | 'import' | 'api';
  };
}

export interface DatabaseQuery extends PaginationQuery {
  filters?: {
    type?: DatabaseType;
    status?: DatabaseStatus;
    integrationId?: string;
    tags?: string[];
  };
}

export interface DatabaseDocumentQuery extends PaginationQuery {
  filters?: {
    databaseId?: string;
    type?: DatabaseType;
    itemStatus?: string;
    opportunityType?: BusinessOpportunityType;
    opportunityStatus?: OpportunityStatus;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    externalId?: string;
    // Property-specific filters
    propertyType?: PropertyType[];
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minParkingSpaces?: number;
    maxParkingSpaces?: number;
    minArea?: number;
    maxArea?: number;
    city?: string;
    neighborhood?: string;
    // IDs filter — used by Pinecone hybrid search to restrict results to specific document IDs
    _ids?: string[];
  };
}

export interface DatabaseListResponse extends ListResponse<DatabaseResponse> {}
export interface DatabaseDocumentListResponse<T = Record<string, unknown>> extends ListResponse<DatabaseDocumentResponse<T>> {}

// ============================================================================
// SYNC RESULT TYPES
// ============================================================================

/**
 * Database Sync Result
 *
 * Resultado de operação de sincronização com provider
 */
export interface DatabaseSyncResult {
  documentsCreated: number;
  documentsUpdated: number;
  documentsDeleted: number;
  errors: Array<{
    providerDocumentId: string;
    error: string;
  }>;
  summary: {
    totalProcessed: number;
    successCount: number;
    errorCount: number;
  };
}

// ============================================================================
// DOCUMENT TRANSFER (COPIAR / MOVER ENTRE BASES)
// ============================================================================

/**
 * Corpo das DUAS rotas de lote:
 *   POST /api/databases/documents/copy  → permissão `databases:create`
 *   POST /api/databases/documents/move  → permissão `databases:update`
 *
 * NÃO existe campo de operação: o modo é a ROTA. O middleware de permissão
 * aceita uma ação por rota — com um campo `operation` no corpo, quem só tem
 * `databases:create` conseguiria disfarçar um mover.
 *
 * "Duplicar aqui" é a rota de CÓPIA com `targetDatabaseId` = a base atual.
 * `appId`/`companyId` NUNCA vêm daqui — saem de `res.locals`.
 */
export interface DatabaseDocumentTransferRequest {
  /**
   * De 1 a `DATABASE_DOCUMENT_TRANSFER_MAX_ITEMS` ids. Ids repetidos no mesmo
   * pedido são reduzidos a um pelo backend, em silêncio.
   */
  documentIds: string[];

  /**
   * Base de destino. Tem que ser do MESMO tipo da base de origem, e quem
   * confere é o backend — o filtro do dropdown é conveniência, não é a
   * garantia.
   */
  targetDatabaseId: string;
}

/** Desfecho de UM item do lote. */
export type DatabaseDocumentTransferItemStatus = 'copied' | 'moved' | 'rejected';

/**
 * Motivo da recusa como CÓDIGO, nunca frase livre — é o que deixa a tela
 * escrever o texto em português sem interpretar mensagem do servidor.
 */
export type DatabaseDocumentTransferRejectionCode =
  | 'not_found'           // id inexistente, de outra empresa, apagado ou de página velha
  | 'wrong_type'          // base de destino é de outro tipo (imóvel só vai para base de imóveis)
  | 'inactive_target'     // base de destino inativa ou arquivada
  | 'integration_target'  // base de destino é espelho de ERP — recebe cópia, não recebe mover
  | 'integration_linked'  // registro veio de ERP — não pode ser movido (isDocumentIntegrationLinked)
  | 'same_database'       // destino igual à base atual
  | 'write_failed';       // a escrita no Mongo não confirmou

/** Desfecho de UM item, na mesma ordem em que os ids foram lidos. */
export interface DatabaseDocumentTransferItemResult {
  /** Id pedido, sempre ecoado — é por ele que a tela casa o desfecho com a linha. */
  documentId: string;

  status: DatabaseDocumentTransferItemStatus;

  /** Só em `copied`: o id do registro que nasceu. */
  newDocumentId?: string;

  /** Só em `rejected`. */
  reasonCode?: DatabaseDocumentTransferRejectionCode;

  /**
   * Só em `copied`: nomes dos campos que a cópia nasceu SEM — `slug`,
   * `externalId`, `externalMetadata` e, quando a base de destino tem
   * integração, o código de identidade do tipo (`reference`, `sku` ou
   * `licensePlate`). Sem integração no destino, o código de identidade é
   * mantido. É informativo: serve para a tela avisar que a referência ficou
   * em branco. QUAL campo some em cada tipo é regra do backend e não vem
   * para o pacote.
   */
  clearedFields?: string[];

  /**
   * Só em `moved`: `true` quando o reapontamento do vetor falhou. O registro
   * ESTÁ na base nova (o Mongo é a verdade), mas pode demorar a aparecer nas
   * buscas do agente. Repetir a mesma ação conserta — reapontar é idempotente.
   */
  indexPending?: boolean;
}

/**
 * Resultado do lote. A rota devolve 200 mesmo com falha parcial: resultado de
 * lote não é erro. Molde do `ViewIngestResult` (`views.ts`) — e NÃO do
 * `{ affected: N }` dos módulos de lote, que engole quem falhou.
 *
 * Invariantes: `results.length === summary.requested` e
 * `summary.succeeded + summary.rejected === summary.requested`.
 */
export interface DatabaseDocumentTransferResult {
  summary: {
    /** Ids processados DEPOIS de tirar os repetidos. */
    requested: number;
    /** Itens com status `copied` ou `moved`. */
    succeeded: number;
    /** Itens com status `rejected`. */
    rejected: number;
  };
  results: DatabaseDocumentTransferItemResult[];
}

/**
 * Teto de itens por pedido: o backend recusa com 422 acima disso e a tela usa o
 * mesmo número para não mandar mais do que a rota aceita. A seleção da tela
 * alcança só a página visível (12 itens), então o teto sobra de propósito.
 */
export const DATABASE_DOCUMENT_TRANSFER_MAX_ITEMS = 50;

/**
 * Forma mínima aceita por `isDocumentIntegrationLinked`.
 *
 * `data` é `unknown` de propósito: no backend a repository devolve
 * `DatabaseDocumentResponse<unknown>` quando ninguém passa o genérico
 * (`documents-repository.ts` declara `findById<T = unknown>` /
 * `findByIds<T = unknown>`), e o documento cru do Mongo também chega sem forma.
 * No frontend o mesmo objeto chega como
 * `DatabaseDocumentResponse<DatabasePropertyData>` e satisfaz este contrato sem
 * nenhum cast.
 */
export interface DatabaseDocumentIntegrationLinkInput {
  metadata?: { source?: string | null } | null;
  data?: unknown;
}

/**
 * `true` quando o registro está preso a um sistema externo (ERP): carimbo de
 * origem `integration` OU `data.externalId` preenchido.
 *
 * UMA regra, UM lugar: o backend recusa o MOVER com isso e o frontend
 * desabilita o item do menu com o MESMO booleano. Duas cópias divergem e a tela
 * passa a oferecer o que a API recusa.
 *
 * NÃO olha `providerSync`: o campo existe em `DatabaseDocument`, mas
 * `src/modules/databases` do backend não tem NENHUMA escrita nele — é campo
 * morto (o `providerSync` que o backend usa de verdade é o do calendário, campo
 * de mesmo nome em outra coleção).
 *
 * COPIAR registro de ERP continua liberado: a cópia nasce com
 * `metadata.source: 'manual'` e sem `externalId`, então esta função devolve
 * `false` para ela.
 */
export function isDocumentIntegrationLinked(
  doc: DatabaseDocumentIntegrationLinkInput | null | undefined
): boolean {
  if (!doc) return false;

  if (doc.metadata?.source === 'integration') return true;

  const data: unknown = doc.data;
  if (typeof data !== 'object' || data === null) return false;

  const externalId: unknown = (data as { externalId?: unknown }).externalId;
  return typeof externalId === 'string' && externalId.trim().length > 0;
}

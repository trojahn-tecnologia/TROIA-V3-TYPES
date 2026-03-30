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
import { PaginationQuery, ListResponse } from './common';
export declare enum BusinessOpportunityType {
    SALE = "sale",
    RENT = "rent",
    SEASONAL_RENT = "seasonal_rent",
    DAILY_RENT = "daily_rent",
    LEASE = "lease",
    EXCHANGE = "exchange",
    DONATION = "donation",
    AUCTION = "auction"
}
export declare enum OpportunityStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    RESERVED = "reserved",
    IN_NEGOTIATION = "in_negotiation",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
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
export declare enum DatabaseType {
    PROPERTIES = "properties",
    VEHICLES = "vehicles",
    PRODUCTS = "products",
    SERVICES = "services",
    DOCUMENTS = "documents"
}
export declare enum DatabaseStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ARCHIVED = "archived"
}
export declare enum PropertyType {
    HOUSE = "house",
    APARTMENT = "apartment",
    COMMERCIAL = "commercial",
    LAND = "land",
    FARM = "farm",
    WAREHOUSE = "warehouse",
    OFFICE = "office",
    STUDIO = "studio",
    PENTHOUSE = "penthouse",
    TOWNHOUSE = "townhouse"
}
export declare enum PropertyItemStatus {
    AVAILABLE = "available",
    UNAVAILABLE = "unavailable",
    UNDER_CONSTRUCTION = "under_construction",
    RESERVED = "reserved",
    ARCHIVED = "archived"
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
    /** Detailed description */
    description: string;
    /** Internal reference code */
    reference?: string;
    /** Type of property */
    propertyType: PropertyType;
    /** Full address */
    address: PropertyAddress;
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
    externalMetadata?: Record<string, any>;
    /** Tags for categorization */
    tags?: string[];
    /** Custom fields */
    customFields?: Record<string, any>;
}
export declare enum VehicleType {
    CAR = "car",
    MOTORCYCLE = "motorcycle",
    TRUCK = "truck",
    SUV = "suv",
    VAN = "van",
    BUS = "bus",
    BOAT = "boat",
    JET_SKI = "jet_ski",
    BICYCLE = "bicycle"
}
export declare enum FuelType {
    GASOLINE = "gasoline",
    ETHANOL = "ethanol",
    DIESEL = "diesel",
    ELECTRIC = "electric",
    HYBRID = "hybrid",
    FLEX = "flex"
}
export declare enum TransmissionType {
    MANUAL = "manual",
    AUTOMATIC = "automatic",
    SEMI_AUTOMATIC = "semi_automatic",
    CVT = "cvt"
}
export declare enum VehicleCondition {
    NEW = "new",
    USED = "used",
    CERTIFIED = "certified"
}
export declare enum VehicleItemStatus {
    AVAILABLE = "available",
    UNAVAILABLE = "unavailable",
    IN_MAINTENANCE = "in_maintenance",
    RESERVED = "reserved",
    ARCHIVED = "archived"
}
export interface DatabaseVehicleData {
    /** Vehicle brand */
    brand: string;
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
    externalMetadata?: Record<string, any>;
    /** Tags */
    tags?: string[];
    /** Custom fields */
    customFields?: Record<string, any>;
}
export declare enum ProductCategory {
    ELECTRONICS = "electronics",
    FURNITURE = "furniture",
    CLOTHING = "clothing",
    FOOD = "food",
    BOOKS = "books",
    TOYS = "toys",
    SPORTS = "sports",
    BEAUTY = "beauty",
    AUTOMOTIVE = "automotive",
    HOME_GARDEN = "home_garden",
    OTHER = "other"
}
export declare enum ProductItemStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    OUT_OF_STOCK = "outofstock",
    DISCONTINUED = "discontinued",
    ARCHIVED = "archived"
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
    externalMetadata?: Record<string, any>;
    /** Tags */
    tags?: string[];
    /** Custom fields */
    customFields?: Record<string, any>;
}
export declare enum ServiceType {
    CONSULTING = "consulting",
    MAINTENANCE = "maintenance",
    INSTALLATION = "installation",
    REPAIR = "repair",
    CLEANING = "cleaning",
    DESIGN = "design",
    DEVELOPMENT = "development",
    MARKETING = "marketing",
    EDUCATION = "education",
    HEALTH = "health",
    LEGAL = "legal",
    FINANCIAL = "financial",
    OTHER = "other"
}
export declare enum ServiceDeliveryMethod {
    IN_PERSON = "in-person",
    REMOTE = "remote",
    HYBRID = "hybrid"
}
export declare enum ServiceItemStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    ARCHIVED = "archived"
}
export interface DatabaseServiceData {
    /** Service name */
    name: string;
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
    externalMetadata?: Record<string, any>;
    /** Tags */
    tags?: string[];
    /** Custom fields */
    customFields?: Record<string, any>;
}
export declare enum DocumentCategory {
    ARTICLE = "article",
    MANUAL = "manual",
    FAQ = "faq",
    POLICY = "policy",
    GUIDE = "guide",
    TUTORIAL = "tutorial",
    REPORT = "report",
    WHITEPAPER = "whitepaper",
    CASE_STUDY = "case_study",
    OTHER = "other"
}
export declare enum DocumentItemStatus {
    PUBLISHED = "published",
    DRAFT = "draft",
    ARCHIVED = "archived"
}
export interface DatabaseDocumentData {
    /** Document title */
    title: string;
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
    /** External system ID */
    externalId?: string;
    /** External system metadata */
    externalMetadata?: Record<string, any>;
    /** Tags */
    tags?: string[];
    /** Custom fields */
    customFields?: Record<string, any>;
}
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
    settings?: Record<string, any>;
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
/**
 * Polymorphic document - data structure varies based on 'type' field
 */
/**
 * Database Provider Sync Status
 *
 * Estados possíveis de sincronização com provider externo
 */
export type DatabaseProviderSyncStatus = 'pending' | 'synced' | 'failed';
/**
 * Database Provider Sync Entry
 *
 * Registro de sincronização com um provider específico
 * Permite múltiplos providers sincronizando o mesmo documento
 */
export interface DatabaseProviderSyncEntry {
    integrationId: string;
    providerId: string;
    providerDocumentId: string;
    syncStatus: DatabaseProviderSyncStatus;
    lastSyncAt: string;
    syncError?: string;
}
export interface DatabaseDocument<T = any> {
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
        updatedBy?: string;
        source?: 'manual' | 'integration' | 'import' | 'api';
        lastSyncedAt?: Date;
    };
    /** Provider sync tracking (para multi-provider support) */
    providerSync?: DatabaseProviderSyncEntry[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface DatabaseDocumentResponse<T = any> extends Omit<DatabaseDocument<T>, '_id' | 'appId' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    id: string;
    appId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface CreateDatabaseRequest {
    name: string;
    type: DatabaseType;
    description?: string;
    tags?: string[];
    settings?: Record<string, any>;
    /** Optional integration setup */
    useIntegration?: boolean;
    providerId?: string;
    integrationConfig?: Record<string, any>;
    integrationCredentials?: Record<string, any>;
    /** Sync configuration */
    syncConfig?: Omit<DatabaseSyncConfig, 'lastSyncAt' | 'nextSyncAt'>;
}
export interface UpdateDatabaseRequest {
    name?: string;
    description?: string;
    status?: DatabaseStatus;
    tags?: string[];
    settings?: Record<string, any>;
    syncConfig?: Partial<DatabaseSyncConfig>;
    domains?: string[];
}
export interface CreateDatabaseDocumentRequest<T = any> {
    databaseId: string;
    type: DatabaseType;
    data: T;
    metadata?: {
        source?: 'manual' | 'integration' | 'import' | 'api';
    };
}
export interface UpdateDatabaseDocumentRequest<T = any> {
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
        _ids?: string[];
    };
}
export interface DatabaseListResponse extends ListResponse<DatabaseResponse> {
}
export interface DatabaseDocumentListResponse<T = any> extends ListResponse<DatabaseDocumentResponse<T>> {
}
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

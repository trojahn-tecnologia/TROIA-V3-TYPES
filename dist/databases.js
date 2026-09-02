"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_DOCUMENT_TRANSFER_MAX_ITEMS = exports.DocumentItemStatus = exports.DocumentCategory = exports.ServiceItemStatus = exports.ServiceDeliveryMethod = exports.ServiceType = exports.ProductItemStatus = exports.ProductCategory = exports.VehicleItemStatus = exports.VehicleCondition = exports.TransmissionType = exports.FuelType = exports.VehicleType = exports.PropertyItemStatus = exports.PropertyType = exports.DatabaseStatus = exports.DatabaseType = exports.OpportunityStatus = exports.BusinessOpportunityType = void 0;
exports.isDocumentIntegrationLinked = isDocumentIntegrationLinked;
// ============================================================================
// BUSINESS OPPORTUNITY TYPES (Core Reusable Types)
// ============================================================================
var BusinessOpportunityType;
(function (BusinessOpportunityType) {
    BusinessOpportunityType["SALE"] = "sale";
    BusinessOpportunityType["RENT"] = "rent";
    BusinessOpportunityType["SEASONAL_RENT"] = "seasonal_rent";
    BusinessOpportunityType["DAILY_RENT"] = "daily_rent";
    BusinessOpportunityType["LEASE"] = "lease";
    BusinessOpportunityType["EXCHANGE"] = "exchange";
    BusinessOpportunityType["DONATION"] = "donation";
    BusinessOpportunityType["AUCTION"] = "auction";
})(BusinessOpportunityType || (exports.BusinessOpportunityType = BusinessOpportunityType = {}));
var OpportunityStatus;
(function (OpportunityStatus) {
    OpportunityStatus["ACTIVE"] = "active";
    OpportunityStatus["INACTIVE"] = "inactive";
    OpportunityStatus["RESERVED"] = "reserved";
    OpportunityStatus["IN_NEGOTIATION"] = "in_negotiation";
    OpportunityStatus["COMPLETED"] = "completed";
    OpportunityStatus["CANCELLED"] = "cancelled";
})(OpportunityStatus || (exports.OpportunityStatus = OpportunityStatus = {}));
// ============================================================================
// DATABASE TYPES
// ============================================================================
var DatabaseType;
(function (DatabaseType) {
    DatabaseType["PROPERTIES"] = "properties";
    DatabaseType["VEHICLES"] = "vehicles";
    DatabaseType["PRODUCTS"] = "products";
    DatabaseType["SERVICES"] = "services";
    DatabaseType["DOCUMENTS"] = "documents";
})(DatabaseType || (exports.DatabaseType = DatabaseType = {}));
var DatabaseStatus;
(function (DatabaseStatus) {
    DatabaseStatus["ACTIVE"] = "active";
    DatabaseStatus["INACTIVE"] = "inactive";
    DatabaseStatus["ARCHIVED"] = "archived";
})(DatabaseStatus || (exports.DatabaseStatus = DatabaseStatus = {}));
// ============================================================================
// PROPERTY DATABASE TYPE
// ============================================================================
var PropertyType;
(function (PropertyType) {
    PropertyType["HOUSE"] = "house";
    PropertyType["APARTMENT"] = "apartment";
    PropertyType["COMMERCIAL"] = "commercial";
    PropertyType["LAND"] = "land";
    PropertyType["FARM"] = "farm";
    PropertyType["WAREHOUSE"] = "warehouse";
    PropertyType["OFFICE"] = "office";
    PropertyType["STUDIO"] = "studio";
    PropertyType["PENTHOUSE"] = "penthouse";
    PropertyType["TOWNHOUSE"] = "townhouse";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
var PropertyItemStatus;
(function (PropertyItemStatus) {
    PropertyItemStatus["AVAILABLE"] = "available";
    PropertyItemStatus["UNAVAILABLE"] = "unavailable";
    PropertyItemStatus["UNDER_CONSTRUCTION"] = "under_construction";
    PropertyItemStatus["RESERVED"] = "reserved";
    PropertyItemStatus["ARCHIVED"] = "archived";
})(PropertyItemStatus || (exports.PropertyItemStatus = PropertyItemStatus = {}));
// ============================================================================
// VEHICLE DATABASE TYPE
// ============================================================================
var VehicleType;
(function (VehicleType) {
    VehicleType["CAR"] = "car";
    VehicleType["MOTORCYCLE"] = "motorcycle";
    VehicleType["TRUCK"] = "truck";
    VehicleType["SUV"] = "suv";
    VehicleType["VAN"] = "van";
    VehicleType["BUS"] = "bus";
    VehicleType["BOAT"] = "boat";
    VehicleType["JET_SKI"] = "jet_ski";
    VehicleType["BICYCLE"] = "bicycle";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var FuelType;
(function (FuelType) {
    FuelType["GASOLINE"] = "gasoline";
    FuelType["ETHANOL"] = "ethanol";
    FuelType["DIESEL"] = "diesel";
    FuelType["ELECTRIC"] = "electric";
    FuelType["HYBRID"] = "hybrid";
    FuelType["FLEX"] = "flex";
})(FuelType || (exports.FuelType = FuelType = {}));
var TransmissionType;
(function (TransmissionType) {
    TransmissionType["MANUAL"] = "manual";
    TransmissionType["AUTOMATIC"] = "automatic";
    TransmissionType["SEMI_AUTOMATIC"] = "semi_automatic";
    TransmissionType["CVT"] = "cvt";
})(TransmissionType || (exports.TransmissionType = TransmissionType = {}));
var VehicleCondition;
(function (VehicleCondition) {
    VehicleCondition["NEW"] = "new";
    VehicleCondition["USED"] = "used";
    VehicleCondition["CERTIFIED"] = "certified";
})(VehicleCondition || (exports.VehicleCondition = VehicleCondition = {}));
var VehicleItemStatus;
(function (VehicleItemStatus) {
    VehicleItemStatus["AVAILABLE"] = "available";
    VehicleItemStatus["UNAVAILABLE"] = "unavailable";
    VehicleItemStatus["IN_MAINTENANCE"] = "in_maintenance";
    VehicleItemStatus["RESERVED"] = "reserved";
    VehicleItemStatus["ARCHIVED"] = "archived";
})(VehicleItemStatus || (exports.VehicleItemStatus = VehicleItemStatus = {}));
// ============================================================================
// PRODUCT DATABASE TYPE
// ============================================================================
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ELECTRONICS"] = "electronics";
    ProductCategory["FURNITURE"] = "furniture";
    ProductCategory["CLOTHING"] = "clothing";
    ProductCategory["FOOD"] = "food";
    ProductCategory["BOOKS"] = "books";
    ProductCategory["TOYS"] = "toys";
    ProductCategory["SPORTS"] = "sports";
    ProductCategory["BEAUTY"] = "beauty";
    ProductCategory["AUTOMOTIVE"] = "automotive";
    ProductCategory["HOME_GARDEN"] = "home_garden";
    ProductCategory["OTHER"] = "other";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductItemStatus;
(function (ProductItemStatus) {
    ProductItemStatus["ACTIVE"] = "active";
    ProductItemStatus["INACTIVE"] = "inactive";
    ProductItemStatus["OUT_OF_STOCK"] = "outofstock";
    ProductItemStatus["DISCONTINUED"] = "discontinued";
    ProductItemStatus["ARCHIVED"] = "archived";
})(ProductItemStatus || (exports.ProductItemStatus = ProductItemStatus = {}));
// ============================================================================
// SERVICE DATABASE TYPE
// ============================================================================
var ServiceType;
(function (ServiceType) {
    ServiceType["CONSULTING"] = "consulting";
    ServiceType["MAINTENANCE"] = "maintenance";
    ServiceType["INSTALLATION"] = "installation";
    ServiceType["REPAIR"] = "repair";
    ServiceType["CLEANING"] = "cleaning";
    ServiceType["DESIGN"] = "design";
    ServiceType["DEVELOPMENT"] = "development";
    ServiceType["MARKETING"] = "marketing";
    ServiceType["EDUCATION"] = "education";
    ServiceType["HEALTH"] = "health";
    ServiceType["LEGAL"] = "legal";
    ServiceType["FINANCIAL"] = "financial";
    ServiceType["OTHER"] = "other";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var ServiceDeliveryMethod;
(function (ServiceDeliveryMethod) {
    ServiceDeliveryMethod["IN_PERSON"] = "in-person";
    ServiceDeliveryMethod["REMOTE"] = "remote";
    ServiceDeliveryMethod["HYBRID"] = "hybrid";
})(ServiceDeliveryMethod || (exports.ServiceDeliveryMethod = ServiceDeliveryMethod = {}));
var ServiceItemStatus;
(function (ServiceItemStatus) {
    ServiceItemStatus["ACTIVE"] = "active";
    ServiceItemStatus["INACTIVE"] = "inactive";
    ServiceItemStatus["SUSPENDED"] = "suspended";
    ServiceItemStatus["ARCHIVED"] = "archived";
})(ServiceItemStatus || (exports.ServiceItemStatus = ServiceItemStatus = {}));
// ============================================================================
// DOCUMENT DATABASE TYPE (Knowledge Base for AI Agents)
// ============================================================================
var DocumentCategory;
(function (DocumentCategory) {
    DocumentCategory["ARTICLE"] = "article";
    DocumentCategory["MANUAL"] = "manual";
    DocumentCategory["FAQ"] = "faq";
    DocumentCategory["POLICY"] = "policy";
    DocumentCategory["GUIDE"] = "guide";
    DocumentCategory["TUTORIAL"] = "tutorial";
    DocumentCategory["REPORT"] = "report";
    DocumentCategory["WHITEPAPER"] = "whitepaper";
    DocumentCategory["CASE_STUDY"] = "case_study";
    DocumentCategory["OTHER"] = "other";
})(DocumentCategory || (exports.DocumentCategory = DocumentCategory = {}));
var DocumentItemStatus;
(function (DocumentItemStatus) {
    DocumentItemStatus["PUBLISHED"] = "published";
    DocumentItemStatus["DRAFT"] = "draft";
    DocumentItemStatus["ARCHIVED"] = "archived";
})(DocumentItemStatus || (exports.DocumentItemStatus = DocumentItemStatus = {}));
/**
 * Teto de itens por pedido: o backend recusa com 422 acima disso e a tela usa o
 * mesmo número para não mandar mais do que a rota aceita. A seleção da tela
 * alcança só a página visível (12 itens), então o teto sobra de propósito.
 */
exports.DATABASE_DOCUMENT_TRANSFER_MAX_ITEMS = 50;
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
function isDocumentIntegrationLinked(doc) {
    if (!doc)
        return false;
    if (doc.metadata?.source === 'integration')
        return true;
    const data = doc.data;
    if (typeof data !== 'object' || data === null)
        return false;
    const externalId = data.externalId;
    return typeof externalId === 'string' && externalId.trim().length > 0;
}

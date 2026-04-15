import { ObjectId } from 'mongodb';
import { PaginationQuery, ListResponse, GenericQueryOptions, ExtendedStatus } from './common';
import type { ChannelWarmup } from './credits';
import type { DistributionConfig } from './distribution';

// ============================================================================
// EMAIL CHANNEL CONFIG (for email-resend provider)
// ============================================================================

export interface EmailChannelConfig {
  domainId: string;
  emailAddress: string;
  displayName: string;
  signature?: string;
  autoCreateTicket?: boolean;
  ticketCategory?: string;
  ticketPriority?: string;
  ticketTeamId?: string;
  autoReplyEnabled?: boolean;
  autoReplyMessage?: string;
}

// ============================================================================
// CHANNEL PROVIDER TYPES (CompanyIntegration defined in company-integrations.ts)
// ============================================================================

export interface ChannelProvider {
  name: string;
  categories: string[];
  capabilities: string[];
  status: ExtendedStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CHANNEL EXPIRATION CONFIG
// ============================================================================

/**
 * Configuração de expiração de atendimento para canais.
 * Permite finalizar automaticamente conversas inativas após um período.
 */
export interface ChannelExpirationConfig {
  /** Se a expiração de atendimento está habilitada */
  enabled: boolean;
  /** Tempo em minutos para considerar um atendimento expirado */
  expirationMinutes: number;
  /** Mensagem opcional a ser enviada quando o atendimento expirar */
  expirationMessage?: string;
}

// ============================================================================
// CHANNEL USER (operators vinculados a um canal)
// ============================================================================

export type ChannelUserRole = 'viewer' | 'attendant';
export type ChannelUserScope = 'own' | 'team' | 'all';

export interface ChannelUser {
  id: string;
  channelId: string;
  userId: string;
  role: ChannelUserRole;
  scope: ChannelUserScope;
  priority?: number | null;
  capabilities?: string[];
  status: 'active' | 'inactive';
  assignedAt: string;
}

// ============================================================================
// CHANNEL ENTITY
// ============================================================================

export interface Channel {
  name: string;
  integrationId: ObjectId;    // Reference to the automatically created integration
  identifier: string;
  providerId?: string;        // Provider ID for conditional UI rendering
  instanceKey?: string;       // For Gateway providers
  instanceToken?: string;     // For Gateway providers
  identifyUser?: boolean;     // If true, operator name is added to outgoing messages
  /** Configuração de expiração automática de atendimentos */
  expirationConfig?: ChannelExpirationConfig;
  /**
   * Distribuição automática de conversas — config unificada (D8, D9).
   * Mesmo shape que `Funnel.assignmentConfig` e `TicketPipeline.assignmentConfig`.
   */
  assignmentConfig: DistributionConfig;
  companyId: ObjectId;
  appId: ObjectId;
  status: ExtendedStatus;     // 'active' | 'inactive' | 'pending' | 'suspended' | 'error'
  /**
   * Contador monotônico de rotação usado por `DistributionService`.
   * Incrementado atomicamente via `$inc` a cada atribuição. O userId
   * selecionado é `pool[lastAssignedUserId % pool.length]`. Ver decisão D4.
   */
  lastAssignedUserId?: number;
  warmup?: ChannelWarmup;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Generic Query Types - CompanyIntegrationQuery defined in company-integrations.ts

export interface ChannelQuery extends PaginationQuery {
  integrationId?: string;
  identifier?: string;
  status?: ExtendedStatus;
}

// Response Types
export type ChannelProviderResponse = Omit<ChannelProvider, never>;
export type ChannelResponse = Omit<Channel, '_id' | 'createdAt' | 'updatedAt' | 'integrationId' | 'companyId' | 'appId'> & {
  id: string;
  integrationId: string;     // ObjectId → string
  companyId: string;          // ObjectId → string
  appId: string;              // ObjectId → string
  createdAt: string;          // Date → ISO string
  updatedAt: string;          // Date → ISO string
  capabilities?: string[];    // Provider capabilities from aggregation
  members?: Array<{ id: string; name: string; avatar?: string }>;
  config?: Record<string, unknown>;  // Widget configuration (optional, for website-widget provider)
  qrCode?: string;            // QR Code for gateway providers
  qrCodeExpires?: number;     // QR Code expiration timestamp (Unix timestamp in seconds)
  integration?: {             // Integration credentials from company-integrations
    instanceKey: string | null;
    instanceToken: string | null;
  };
};


// List Response Types
export interface ChannelProviderListResponse extends ListResponse<ChannelProviderResponse> {}
export interface ChannelListResponse extends ListResponse<ChannelResponse> {}

// Query Options Types
export interface ChannelQueryOptions extends GenericQueryOptions<ChannelQuery> {}

// ============================================================================
// SPECIFIC REQUEST TYPES
// ============================================================================

export interface CreateChannelRequest {
  name: string;
  identifier: string;
  assignmentConfig: DistributionConfig;
  providerId: string;
  config: Record<string, unknown>;
  credentials: Record<string, unknown>;
  integrationName?: string;
  integrationDescription?: string;
}

export interface CreateChannelRepositoryRequest {
  name: string;
  identifier: string;
  assignmentConfig: DistributionConfig;
  integrationId: string;
}
export interface UpdateChannelRequest {
  name?: string;
  identifier?: string;
  assignmentConfig?: DistributionConfig;
  identifyUser?: boolean;
  /** Configuração de expiração automática de atendimentos */
  expirationConfig?: ChannelExpirationConfig;
  status?: ExtendedStatus;
}

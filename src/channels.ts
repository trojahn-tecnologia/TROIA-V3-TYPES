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

/**
 * Horário de funcionamento para contas Business.
 * open_time/close_time são minutos desde meia-noite (ex: 480 = 08:00).
 */
export interface ChannelBusinessHours {
  dayOfWeek: string;             // mon, tue, wed, thu, fri, sat, sun
  mode: string;                  // 'open_24h' | 'appointment_only' | 'specific_hours'
  openTime?: number;             // minutos desde meia-noite
  closeTime?: number;
}

/**
 * Informações da conta conectada — preenchidas pelo provider (Baileys/whatsmeow)
 * no momento da conexão e em eventos de atualização. Permite enriquecer a UI do
 * card de canal com foto, nome de exibição, business profile e plataforma reais.
 */
export interface ChannelAccountInfo {
  // Identidade básica
  pushName?: string;             // Nome do perfil (ex: "João Silva")
  verifiedName?: string;         // Nome verificado em contas Business
  businessName?: string;         // Nome comercial (para Business)
  platform?: string;             // ios, android, web, windows, mac

  // Imagens
  profilePictureUrl?: string;    // URL da foto de perfil (WhatsApp CDN — pode expirar)
  hasProfilePicture?: boolean;   // true quando a conta tem foto mas o servidor bloqueou URL (anti-scraping)
  coverPhotoUrl?: string;        // URL da foto de capa (apenas contas Business)

  // Recado/status do perfil
  status?: string;

  // Business profile (só preenchido em contas Business)
  description?: string;          // Descrição do negócio
  email?: string;
  address?: string;
  websites?: string[];
  category?: string;             // Categoria principal
  categories?: string[];         // Todas as categorias (Go expõe lista)
  businessHours?: ChannelBusinessHours[];
  timezone?: string;             // IANA TZ (ex: "America/Sao_Paulo")

  updatedAt?: string;            // ISO timestamp da última atualização
}

export interface Channel {
  name: string;
  integrationId: ObjectId;    // Reference to the automatically created integration
  identifier: string;         // ✅ Apenas dígitos (ex: "5511999887766") — normalizado
  providerId?: string;        // Provider ID for conditional UI rendering
  instanceKey?: string;       // For Gateway providers
  instanceToken?: string;     // For Gateway providers
  identifyUser?: boolean;     // If true, operator name is added to outgoing messages
  accountInfo?: ChannelAccountInfo; // ✅ Dados vindos do provider ao conectar
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
    /** WhatsApp Business — modo de conexão (intent do usuário). */
    mode?: 'standalone' | 'coexistence';
    /** WhatsApp Business — accountMode confirmado pela Meta. */
    accountMode?: 'STANDALONE' | 'COEXISTENCE';
  };
  /**
   * Métricas agregadas do canal — populadas no list/getById.
   * `messagesLast7Days`: contagem de mensagens (inbound + outbound) dos últimos 7 dias.
   * `conversations`: conversas ativas/waiting no canal.
   */
  stats?: {
    messagesLast7Days?: number;
    conversations?: number;
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

import { ObjectId } from 'mongodb';
import { PaginationQuery, ListResponse, GenericQueryOptions, ExtendedStatus } from './common';
import type { ChannelWarmup } from './credits';
import type { DistributionConfig } from './distribution';
export interface EmailChannelConfig {
    domainId: string;
    emailAddress: string;
    displayName: string;
    signature?: string;
    autoCreateTicket?: boolean;
    /**
     * Modo de criação de ticket a partir de e-mail inbound (Plano B).
     * - 'off': comportamento legado — inbound cria/segue conversation no chat.
     * - 'review': e-mail fica em retenção (`EmailRetention`, status 'pending')
     *   até aprovação manual antes de virar ticket.
     * - 'auto': ticket é criado automaticamente a partir do e-mail.
     * Legado `autoCreateTicket: true` sem este campo ⇒ tratado como 'auto'.
     */
    ticketCreationMode?: 'off' | 'review' | 'auto';
    ticketCategory?: string;
    ticketPriority?: string;
    ticketTeamId?: string;
    autoReplyEnabled?: boolean;
    autoReplyMessage?: string;
}
export interface ChannelProvider {
    name: string;
    categories: string[];
    capabilities: string[];
    status: ExtendedStatus;
    createdAt: Date;
    updatedAt: Date;
}
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
/**
 * Informações sobre a última desconexão do canal — preenchidas pelo backend
 * ao detectar desconexão via provider oficial, gateway ou health check.
 */
export interface ChannelDisconnectInfo {
    reason: string;
    code?: string;
    source: 'official_provider' | 'gateway' | 'health_check';
    at: string;
}
/**
 * Horário de funcionamento para contas Business.
 * open_time/close_time são minutos desde meia-noite (ex: 480 = 08:00).
 */
export interface ChannelBusinessHours {
    dayOfWeek: string;
    mode: string;
    openTime?: number;
    closeTime?: number;
}
/**
 * Informações da conta conectada — preenchidas pelo provider (Baileys/whatsmeow)
 * no momento da conexão e em eventos de atualização. Permite enriquecer a UI do
 * card de canal com foto, nome de exibição, business profile e plataforma reais.
 */
export interface ChannelAccountInfo {
    pushName?: string;
    verifiedName?: string;
    businessName?: string;
    platform?: string;
    profilePictureUrl?: string;
    hasProfilePicture?: boolean;
    coverPhotoUrl?: string;
    status?: string;
    description?: string;
    email?: string;
    address?: string;
    websites?: string[];
    category?: string;
    categories?: string[];
    businessHours?: ChannelBusinessHours[];
    timezone?: string;
    updatedAt?: string;
}
export interface Channel {
    name: string;
    integrationId: ObjectId;
    identifier: string;
    providerId?: string;
    instanceKey?: string;
    instanceToken?: string;
    identifyUser?: boolean;
    accountInfo?: ChannelAccountInfo;
    /** Informações sobre a última desconexão — preenchidas ao detectar status 'error'/'pending' */
    disconnectInfo?: ChannelDisconnectInfo;
    /** Configuração de expiração automática de atendimentos */
    expirationConfig?: ChannelExpirationConfig;
    /**
     * Distribuição automática de conversas — config unificada (D8, D9).
     * Mesmo shape que `Funnel.assignmentConfig` e `TicketPipeline.assignmentConfig`.
     */
    assignmentConfig: DistributionConfig;
    companyId: ObjectId;
    appId: ObjectId;
    status: ExtendedStatus;
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
export interface ChannelQuery extends PaginationQuery {
    integrationId?: string;
    identifier?: string;
    status?: ExtendedStatus;
}
export type ChannelProviderResponse = Omit<ChannelProvider, never>;
export type ChannelResponse = Omit<Channel, '_id' | 'createdAt' | 'updatedAt' | 'integrationId' | 'companyId' | 'appId'> & {
    id: string;
    integrationId: string;
    companyId: string;
    appId: string;
    createdAt: string;
    updatedAt: string;
    capabilities?: string[];
    members?: Array<{
        id: string;
        name: string;
        avatar?: string;
    }>;
    config?: Record<string, unknown>;
    qrCode?: string;
    qrCodeExpires?: number;
    integration?: {
        instanceKey: string | null;
        instanceToken: string | null;
        /** WhatsApp Business — modo de conexão (intent do usuário). */
        mode?: 'standalone' | 'coexistence';
        /** WhatsApp Business — accountMode confirmado pela Meta. */
        accountMode?: 'STANDALONE' | 'COEXISTENCE';
        /** WhatsApp Business — webhook assinado na WABA (setup automático pós Embedded Signup). */
        webhookSubscribed?: boolean;
        /** WhatsApp Business — número registrado na Cloud API (apto a enviar). */
        phoneRegistered?: boolean;
        /** WhatsApp Business — última falha do setup automático (webhook/register). */
        setupError?: string;
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
export interface ChannelProviderListResponse extends ListResponse<ChannelProviderResponse> {
}
export interface ChannelListResponse extends ListResponse<ChannelResponse> {
}
export interface ChannelQueryOptions extends GenericQueryOptions<ChannelQuery> {
}
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
/**
 * Reconexão de canal — body opcional do POST /channels/:id/reconnect.
 * Sem credentials = comportamento legado (gateway QR / teste de conexão).
 * Com credentials.accessToken = renovação de token de provider oficial.
 */
export interface ReconnectChannelRequest {
    credentials?: {
        accessToken: string;
    };
}
/** Resultado do POST /channels/:id/reconnect. */
export interface ReconnectChannelResult {
    success: boolean;
    qrCode?: string;
    qrCodeExpires?: number;
    instanceKey?: string;
    message?: string;
    /** Token salvo, mas a reassinatura do webhook falhou (aviso não-bloqueante). */
    webhookWarning?: string;
}
/**
 * Detalhes de conexão para pré-preencher o form de reconexão de provider oficial.
 * GET /channels/:id/connection-details. Expõe o token atual — endpoint dedicado,
 * permissão channels:update.
 */
export interface ChannelConnectionDetails {
    providerId: string;
    /** Token atual completo (editável no front). */
    accessToken: string;
    /** URL do webhook, derivada no servidor (read-only no front). */
    webhookUrl: string;
    /** Identificadores read-only — só os relevantes ao provider vêm preenchidos. */
    whatsappBusinessAccountId?: string;
    phoneNumberId?: string;
    pageId?: string;
    instagramBusinessAccountId?: string;
}

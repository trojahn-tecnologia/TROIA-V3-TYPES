import { ObjectId } from 'mongodb';
import { FullBaseDocument } from './common';
/**
 * User Integration - Conexão de usuário com serviços externos
 * Depende de app-integration para credenciais OAuth
 *
 * @example
 * // User conecta Google Calendar pessoal usando OAuth app do admin
 * {
 *   userId: "user123",
 *   appIntegrationId: ObjectId("app-integration-id"), // Source de client_id/secret
 *   providerId: "GOOGLE_CALENDAR",
 *   credentials: {
 *     accessToken: "ya29.a0...",
 *     refreshToken: "1//0g...",
 *     expiresAt: new Date("2025-10-27T12:00:00Z"),
 *     scope: "https://www.googleapis.com/auth/calendar"
 *   },
 *   status: "active"
 * }
 */
export interface UserIntegration extends FullBaseDocument {
    /** ID do usuário owner desta integração */
    userId: string;
    /** Empresa do usuário (multi-tenant context) */
    companyId: ObjectId;
    /** App context (multi-tenant) */
    appId: ObjectId;
    /** Referência para app-integration (fornece OAuth client_id/secret) */
    appIntegrationId: ObjectId;
    /** Provider ID (ex: GOOGLE_CALENDAR, OUTLOOK_CALENDAR) */
    providerId: string;
    /** OAuth credentials do usuário */
    credentials: {
        /** Access token para API calls */
        accessToken: string;
        /** Refresh token para renovar access token */
        refreshToken: string;
        /** Data de expiração do access token */
        expiresAt: Date;
        /** Scopes autorizados pelo usuário */
        scope?: string;
    };
    /**
     * Status da integração
     * - pending: Aguardando OAuth flow
     * - active: Integração ativa e funcionando
     * - inactive: Desativada pelo usuário
     * - error: Erro na integração (ex: token expirado)
     * - expired: Token expirado, precisa re-autorizar
     * - auth_failed: Falha de autenticação OAuth (401/token revoked)
     * - disconnected: Desconectada manualmente pelo usuário
     */
    status: 'active' | 'inactive' | 'error' | 'pending' | 'expired' | 'auth_failed' | 'disconnected';
    /** Última sincronização realizada */
    lastSyncAt?: Date;
    /** Última tentativa de sincronização (mesmo que falhe) */
    lastSyncAttemptAt?: Date;
    /** Contador de tentativas de sync falhas consecutivas */
    failedSyncAttempts?: number;
    /** Override sync interval (in minutes) */
    syncInterval?: number;
    /** Última mensagem de erro (se status = error) */
    lastError?: string;
    /** Data em que a autenticação falhou (se status = auth_failed) */
    authFailedAt?: Date;
    /** Razão da falha de autenticação */
    authFailureReason?: string;
}
/**
 * User Integration Response - API response format
 * Expõe id como string, esconde _id ObjectId
 */
export interface UserIntegrationResponse extends Omit<UserIntegration, '_id'> {
    id: string;
}
/**
 * Create User Integration Request
 * Usuário inicia processo de conectar serviço pessoal
 */
export interface CreateUserIntegrationRequest {
    /** Provider a ser conectado */
    providerId: string;
    /** App-integration que fornece OAuth credentials */
    appIntegrationId: string;
}
/**
 * User Integration Query - Filtros para listagem
 */
export interface UserIntegrationQuery {
    /** Filtrar por usuário */
    userId?: string;
    /** Filtrar por provider */
    providerId?: string;
    /** Filtrar por status */
    status?: 'active' | 'inactive' | 'error' | 'pending' | 'expired' | 'auth_failed' | 'disconnected';
}
/**
 * OAuth State - Encoded no state parameter para identificar contexto
 * Usado para rastrear o OAuth flow e prevenir CSRF
 *
 * @example
 * const state: OAuthState = {
 *   integrationId: "user-integration-id",
 *   integrationType: "user",
 *   userId: "user123",
 *   appId: "app123",
 *   companyId: "company123",
 *   timestamp: Date.now(),
 *   signature: "hmac-sha256-signature"
 * };
 *
 * const encoded = Buffer.from(JSON.stringify(state)).toString('base64');
 */
export interface OAuthState {
    /** ID da integração sendo criada/atualizada */
    integrationId: string;
    /** Tipo de integração (app, company, ou user) */
    integrationType: 'app' | 'company' | 'user';
    /** ID do usuário (para user-integrations) */
    userId?: string;
    /** App ID (multi-tenant context) */
    appId: string;
    /** Company ID (multi-tenant context) */
    companyId?: string;
    /** Timestamp para validação de expiração (15 minutos) */
    timestamp: number;
    /** HMAC signature para prevenir tampering */
    signature: string;
}
/**
 * OAuth Tokens - Resultado do token exchange
 */
export interface OAuthTokens {
    /** Access token para API calls */
    accessToken: string;
    /** Refresh token para renovar access token */
    refreshToken: string;
    /** Data de expiração do access token */
    expiresAt: Date;
    /** Scopes autorizados */
    scope: string;
}
/**
 * Provider Auth Error - Erro de autenticação do provider
 * Utilizado para comunicar falhas de OAuth entre provider e módulo
 */
export interface ProviderAuthError {
    /** HTTP status code (geralmente 401) */
    code: number;
    /** Status textual (ex: UNAUTHENTICATED) */
    status: string;
    /** Mensagem de erro detalhada */
    message: string;
    /** Timestamp do erro */
    timestamp: Date;
    /** Dados adicionais do erro (opcional) */
    details?: Record<string, unknown>;
}
/**
 * Auth Error Callback - Função de callback para falhas de autenticação
 * Provider chama este callback quando detecta erro 401/token revoked
 *
 * @param integrationId - ID da user-integration afetada
 * @param error - Detalhes do erro de autenticação
 */
export type AuthErrorCallback = (integrationId: string, error: ProviderAuthError) => Promise<void>;

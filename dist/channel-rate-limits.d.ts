import type { ProviderRateLimits, RateLimitUsage } from './providers';
/**
 * Metadata sobre a integração do canal usada pra controlar UI da tela de
 * Limites de Envio (gateway-whatsapp = tudo editável; whatsapp-business =
 * messagesPerDay vem da Meta automaticamente).
 */
export interface ChannelRateLimitsMeta {
    providerId: string;
    /** True quando o provider recebe webhook de tier da Meta (`whatsapp-business`). */
    supportsAutoTier: boolean;
    /** True quando os valores atuais vieram do webhook (`source === 'webhook'`). */
    isManagedByProvider: boolean;
}
/**
 * Response de GET/PATCH/DELETE /channels/:id/rate-limits.
 *
 * `rateLimits` reflete o estado APÓS a operação:
 * - PATCH: limites editados pelo admin (source: 'manual')
 * - DELETE: limites resetados para o default do provider (source: 'default')
 * - GET: estado atual (qualquer source)
 */
export interface ChannelRateLimitsResponse {
    rateLimits: ProviderRateLimits;
    currentUsage: RateLimitUsage;
    meta: ChannelRateLimitsMeta;
}
/**
 * Body do PATCH. Pelo menos um dos dois campos deve estar presente.
 *
 * - `intervalSeconds`: 1..86400. Convertido em messagesPerHour = ceil(3600 / intervalSeconds).
 * - `messagesPerDay`: 1..10_000_000. Rejeitado para providers com supportsAutoTier=true.
 */
export interface UpdateChannelRateLimitsRequest {
    intervalSeconds?: number;
    messagesPerDay?: number;
}

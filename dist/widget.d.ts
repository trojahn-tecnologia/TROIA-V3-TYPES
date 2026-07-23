import type { PwaIcons } from './app';
/**
 * Hosted Page Layout Type
 */
export type HostedPageLayout = 'centered' | 'fullbleed' | 'split';
/**
 * Hosted Page Configuration
 * Controls the public chat page rendered at /chat/<channelId>
 */
export interface HostedPageConfig {
    enabled: boolean;
    layout: HostedPageLayout;
    headline?: string;
    subtitle?: string;
    logoUrl?: string;
    backgroundColor?: string;
    /** Ícones PWA gerados a partir de logoUrl + backgroundColor (backend). */
    pwaIcons?: PwaIcons;
}
/**
 * Features de envio permitidas pelo widget (FAB + hosted page).
 * Cada flag controla se um tipo de upload aparece na ChatInput.
 * Default: todas false (apenas texto).
 */
export interface WidgetFeatures {
    allowImages?: boolean;
    allowAudio?: boolean;
    allowDocuments?: boolean;
    allowVideo?: boolean;
    /** Exibe o botão "Instalar App" (PWA). Instalação real só na hosted page. */
    allowPwaInstall?: boolean;
    /** Habilita coleta de token de push e alerta por notificação. */
    allowPushNotifications?: boolean;
}
/**
 * Company injetada via window.troiaWidgetConfig.
 * Quando presente, cria/associa um Customer ao contato do visitante.
 * Campos alinhados à nomenclatura de `Customer`.
 */
export interface WidgetCompanyConfig {
    name: string;
    type?: 'PF' | 'PJ';
    document?: string;
    email?: string;
    phone?: string;
}
/**
 * Widget Configuration
 * Passed via window.troiaWidgetConfig or stored in channel config
 */
export interface WidgetConfig {
    channelId: string;
    token: string;
    apiUrl: string;
    socketUrl: string;
    visitorName?: string;
    visitorEmail?: string;
    visitorPhone?: string;
    /** Tags aplicadas ao contato do visitante no registro (união idempotente). */
    visitorTags?: string[];
    /** Company injetada: cria/associa um Customer ao contato. */
    company?: WidgetCompanyConfig;
    hidden?: boolean;
    brandColor?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    welcomeMessage?: string;
    agentName?: string;
    agentAvatar?: string;
    features?: WidgetFeatures;
    hostedPage?: HostedPageConfig;
}

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
    hidden?: boolean;
    brandColor?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    welcomeMessage?: string;
    agentName?: string;
    agentAvatar?: string;
    features?: WidgetFeatures;
    hostedPage?: HostedPageConfig;
}

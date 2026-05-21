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

  // Optional visitor data (skip pre-chat form if provided)
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;

  // Behavior
  hidden?: boolean;

  // UI Customization
  brandColor?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage?: string;
  agentName?: string;
  agentAvatar?: string;

  // Features (media upload control)
  features?: WidgetFeatures;

  // Hosted page configuration
  hostedPage?: HostedPageConfig;
}

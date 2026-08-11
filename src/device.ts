/**
 * Vocabulário comum de dispositivo — compartilhado por `UserDevice`
 * (operadores, embutido em `users.devices[]`) e `ContactDevice`
 * (visitantes, collection dedicada `contact-devices`).
 *
 * Os campos são todos opcionais: o parse de User-Agent é best-effort e a
 * geolocalização é assíncrona (o device é persistido antes dela chegar).
 */
export type DeviceKind = 'smartphone' | 'tablet' | 'desktop' | 'unknown';
export type DeviceOS = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
export type DeviceBrowser = 'chrome' | 'safari' | 'firefox' | 'edge' | 'samsung' | 'opera' | 'unknown';

/** Geolocalização aproximada derivada de IP (nunca GPS). */
export interface DeviceGeo {
  country?: string;
  region?: string;
  city?: string;
}

export interface DeviceInfo {
  deviceKind?: DeviceKind;
  os?: DeviceOS;
  osVersion?: string;
  browser?: DeviceBrowser;
  browserVersion?: string;
  /** "iPhone", "SM-G991B" — quando o UA expõe. */
  model?: string;
  /** User-Agent cru: permite reclassificar sem novo evento. */
  userAgent?: string;
  lastIp?: string;
  location?: DeviceGeo;
}

/**
 * User-Agent Client Hints de alta entropia, coletados no cliente via
 * `navigator.userAgentData.getHighEntropyValues()`.
 *
 * Existem porque o Chrome **removeu** esses dados do User-Agent: desde o Chrome
 * 90 o macOS reporta sempre `10_15_7`, e desde o Chrome 110 (2023) o Android
 * reporta modelo `"K"` e versão `"10"` fixos. Nenhuma biblioteca de parse
 * recupera isso — só os Client Hints. Só existem em browsers Chromium; Safari e
 * Firefox não implementam (lá o UA segue sendo a única fonte).
 */
export interface DeviceClientHints {
  /** Modelo real do aparelho (ex.: "SM-G991B"). Vazio em desktop. */
  model?: string;
  /** "Android" | "macOS" | "Windows" | "iOS" | "Linux" | "Chrome OS". */
  platform?: string;
  /** Versão real do SO (ex.: "15.5"), que o UA congelou. */
  platformVersion?: string;
  /** Versão completa do navegador (ex.: "126.0.6478.127"). */
  browserVersion?: string;
}

/** Por onde o dispositivo chegou. Corte de filtro da futura tela de push em massa. */
export type ContactDeviceOriginType = 'widget' | 'website';

export interface ContactDeviceOrigin {
  type: ContactDeviceOriginType;
  /** Preenchido quando type === 'widget'. */
  channelId?: string;
  /** Preenchido quando type === 'website' (login de visitante — ainda não existe). */
  websiteId?: string;
  /** Widget: onde a sessão roda. Detalhe técnico útil para depurar push. */
  surface?: 'embed' | 'hosted';
  firstSeenAt: string;
  lastSeenAt: string;
}

/** Subscription do Web Push (VAPID) — consumida no P2. */
export interface WebPushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
}

export interface ContactDevicePush {
  provider: string;
  subscription: WebPushSubscription;
  subscribedAt: string;
  lastNotifiedAt?: string;
  invalidatedAt?: string;
}

/** Eventos que criam/atualizam um device. Nunca gravamos em todo acesso. */
export type ContactDeviceEvent = 'pwa-install' | 'push-granted' | 'website-login';

export interface ContactDevice extends DeviceInfo {
  id: string;
  appId: string;
  companyId: string;
  contactId: string;
  /** UUID gerado no cliente, por origem (localStorage). */
  deviceId: string;
  origins: ContactDeviceOrigin[];
  pwaInstalledAt?: string;
  /** 1 browser × origem = 1 subscription ativa (P2). */
  push?: ContactDevicePush;
  createdAt: string;
  lastActiveAt: string;
}

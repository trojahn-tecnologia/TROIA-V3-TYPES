import { ObjectId } from 'mongodb';
import { TenantAwareDocument, FullTenantDocument, ActiveStatus, PaginationQuery, GenericQueryOptions, ListResponse } from "./common";

export interface User extends FullTenantDocument {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  status: ActiveStatus;
  levelId?: ObjectId; // Referência para o nível do usuário (hierarquia)
  preferences: UserPreferences;
  security: UserSecurity;
  permissions: UserPermissions;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  devices?: UserDevice[];
}

export interface UserDevice {
  token: string;
  platform: 'web' | 'android' | 'ios';
  browser?: string;
  deviceModel?: string;
  lastActiveAt: string;
  createdAt: string;
}

// UserRole removido - agora usamos apenas levelId + permissions individuais



export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: UserNotificationPreferences;
  calendar: UserCalendarPreferences;
}

export interface UserNotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
    types: string[];
  };
  whatsapp: {
    enabled: boolean;
    types: string[];
  };
  push: {
    enabled: boolean;
    types: string[];
  };
  inApp: {
    enabled: boolean;
    types: string[];
  };
}

/**
 * User Calendar Preferences
 *
 * Configurações personalizadas de disponibilidade de agenda para cada usuário.
 * Permite definir horários de trabalho, pausas, datas bloqueadas, feriados, etc.
 */
export interface UserCalendarPreferences {
  workingHours: {
    monday: WorkingHoursConfig;
    tuesday: WorkingHoursConfig;
    wednesday: WorkingHoursConfig;
    thursday: WorkingHoursConfig;
    friday: WorkingHoursConfig;
    saturday: WorkingHoursConfig;
    sunday: WorkingHoursConfig;
  };
  breaks: BreakConfig[];
  blockedDates: BlockedDateConfig[];
  holidays: HolidaysConfig;
  meetingBuffer: MeetingBufferConfig;
  defaultMeetingDuration: number; // Duração padrão em minutos (ex: 60)
  dailyMeetingLimit?: DailyMeetingLimitConfig;
}

/**
 * Working Hours Configuration
 *
 * Define horário de trabalho para um dia específico
 */
export interface WorkingHoursConfig {
  enabled: boolean;         // Se usuário trabalha neste dia
  start: string;            // Formato HH:mm (ex: "08:00")
  end: string;              // Formato HH:mm (ex: "18:00")
}

/**
 * Break Configuration
 *
 * Pausas durante o dia (almoço, café, etc.)
 */
export interface BreakConfig {
  name: string;             // Ex: "Almoço", "Café da tarde"
  start: string;            // Formato HH:mm (ex: "12:00")
  end: string;              // Formato HH:mm (ex: "13:00")
  daysOfWeek: number[];     // 0-6 (0=Domingo, 1=Segunda, ..., 6=Sábado)
  enabled: boolean;
}

/**
 * Blocked Date Configuration
 *
 * Datas específicas bloqueadas (férias, eventos pessoais)
 */
export interface BlockedDateConfig {
  startDate: string;        // ISO 8601 date (ex: "2025-12-20")
  endDate: string;          // ISO 8601 date (ex: "2025-12-31")
  reason?: string;          // Motivo (ex: "Férias", "Congresso")
  allDay: boolean;          // Se bloqueia dia inteiro ou horário específico
  startTime?: string;       // Se allDay=false, horário de início (HH:mm)
  endTime?: string;         // Se allDay=false, horário de fim (HH:mm)
}

/**
 * Holidays Configuration
 *
 * Configuração de feriados nacionais/regionais
 */
export interface HolidaysConfig {
  enabled: boolean;         // Se deve bloquear feriados
  country: string;          // Código ISO do país (ex: "BR", "US")
  region?: string;          // Estado/região (ex: "SP", "RJ", "CA")
  customHolidays: CustomHoliday[];
}

/**
 * Custom Holiday
 *
 * Feriado customizado pelo usuário
 */
export interface CustomHoliday {
  date: string;             // ISO 8601 date (ex: "2025-06-09")
  name: string;             // Nome do feriado (ex: "Aniversário da empresa")
  recurring: boolean;       // Se repete anualmente
}

/**
 * Meeting Buffer Configuration
 *
 * Tempo de buffer entre reuniões (para preparação/deslocamento)
 */
export interface MeetingBufferConfig {
  enabled: boolean;
  minutes: number;          // Minutos de buffer (ex: 15)
}

/**
 * Daily Meeting Limit Configuration
 *
 * Limite máximo de reuniões por dia
 */
export interface DailyMeetingLimitConfig {
  enabled: boolean;
  maxMeetings: number;      // Máximo de reuniões por dia (ex: 8)
}


export interface UserSecurity {
  password: UserPassword;
  twoFactor: UserTwoFactor;
  sessions: UserSession[];
  loginAttempts: UserLoginAttempt[];
  passwordResets: UserPasswordReset[];
}

export interface UserPassword {
  hashedPassword: string;
  lastChangedAt: Date;
  expiresAt?: Date;
  requiresChange: boolean;
  history: string[];
}

export interface UserTwoFactor {
  enabled: boolean;
  method?: 'totp' | 'sms' | 'email';
  secret?: string;
  backupCodes?: string[];
  lastUsedAt?: Date;
}

export interface UserSession {
  token: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  device?: string;
  createdAt: Date;
  lastAccessAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface UserLoginAttempt {
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  location?: string;
}

export interface UserPasswordReset {
  token: string;
  requestedAt: Date;
  expiresAt: Date;
  usedAt?: Date;
  ipAddress: string;
  userAgent: string;
}

export interface UserPermissions {
  system: string[];
  company: string[];
  custom: Record<string, string[]>;
}

export interface UserInvitation extends TenantAwareDocument {
  email: string;
  firstName: string;
  lastName: string;
  levelId?: ObjectId; // Nível que será atribuído ao usuário quando aceitar o convite
  invitedBy: ObjectId;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  message?: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  phone?: string;
  levelId?: string; // ID do nível (será convertido para ObjectId no backend)
  preferences?: Partial<UserPreferences>;
  sendInvite?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  status?: ActiveStatus;
  levelId?: string; // ID do nível (será convertido para ObjectId no backend)
  preferences?: Partial<UserPreferences>;
  password?: string; // Senha opcional - será hasheada no backend se fornecida
}

export interface CreateUserInvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  levelId?: string; // ID do nível (será convertido para ObjectId no backend)
  message?: string;
  expiresIn?: number;
}

export interface AcceptInvitationRequest {
  token: string;
  password: string;
  firstName?: string;
  lastName?: string;
  preferences?: Partial<UserPreferences>;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  requiresTwoFactor?: boolean;
  companyName: string; // ✅ Nome da empresa do usuário
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface Enable2FARequest {
  method: 'totp' | 'sms' | 'email';
  code: string;
}

export interface Verify2FARequest {
  code: string;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  expiresAt?: Date;
}

export interface UserActivity extends TenantAwareDocument {
  userId: ObjectId;
  action: string;
  resource?: string;
  resourceId?: ObjectId;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface UserMetrics {
  totalLogins: number;
  lastLogin?: Date;
  activeDevices: number;
  totalSessions: number;
  failedLoginAttempts: number;
  passwordAge: number;
  twoFactorEnabled: boolean;
  apiKeysCount: number;
  lastActivity?: Date;
}

export interface UserAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  data: {
    date: string;
    logins: number;
    sessions: number;
    activity: number;
    devices: number;
  }[];
}

export type UserStatus = ActiveStatus;
// ============================================================
// USER SPECIFIC QUERY & RESPONSE TYPES
// ============================================================

// User query with specific filters
export interface UserQuery extends PaginationQuery {
  status?: ActiveStatus;
  levelId?: string; // Filtrar por nível
  email?: string;
  firstName?: string;
  lastName?: string;
  companyId?: string;
}

// User response (without sensitive data)
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  companyId: string;
  appId: string;
  status: ActiveStatus;
  levelId?: string;
  preferences: UserPreferences;
  permissions: UserPermissions;
  emailVerified?: boolean;
  lastLoginAt?: string;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

// User list response using generic
export interface UserListResponse extends ListResponse<UserResponse> {}

// User query options using generic
export interface UserQueryOptions extends GenericQueryOptions<UserQuery> {}

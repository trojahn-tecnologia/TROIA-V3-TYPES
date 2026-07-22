import { ObjectId } from 'mongodb';
import { TenantAwareDocument, FullTenantDocument, ActiveStatus, PaginationQuery, GenericQueryOptions, ListResponse } from "./common";
import type { LevelResponse } from './levels';
export interface User extends FullTenantDocument {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    status: ActiveStatus;
    levelId?: ObjectId;
    preferences: UserPreferences;
    security: UserSecurity;
    permissions: UserPermissions;
    lastLoginAt?: Date;
    lastActivityAt?: Date;
    devices?: UserDevice[];
    mcpToken?: {
        hash: string;
        prefix: string;
        createdAt: string;
        lastUsedAt?: string;
        lastUsedIp?: string;
        expiresAt?: string;
    };
}
export interface UserDevice {
    deviceId: string;
    token?: string;
    platform: 'web' | 'android' | 'ios';
    browser?: string;
    deviceModel?: string;
    lastActiveAt: string;
    createdAt: string;
    authorizedAt?: string;
    authChannel?: 'email' | 'whatsapp';
}
export interface UserMcpTokenMetadata {
    exists: boolean;
    prefix?: string;
    createdAt?: string;
    lastUsedAt?: string;
    lastUsedIp?: string;
    expiresAt?: string;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    notifications: UserNotificationPreferences;
    calendar: UserCalendarPreferences;
}
/**
 * Preferências de notificação per-user.
 *
 * Semântica de `types?: string[]` em cada canal (IMPORTANTE):
 *   - `undefined` (campo ausente) → user NUNCA configurou → TODOS os tipos permitidos (default)
 *   - `[]` (array vazio) → user configurou e desselecionou tudo → NENHUM tipo permitido
 *   - `['type1', 'type2']` → apenas os tipos listados são permitidos
 *
 * Envios são sempre imediatos — não há mais `frequency` (era um opt-in que
 * complicava a UX pra pouco benefício).
 */
export interface UserNotificationPreferences {
    email: {
        enabled: boolean;
        types?: string[];
    };
    whatsapp: {
        enabled: boolean;
        types?: string[];
    };
    push: {
        enabled: boolean;
        types?: string[];
    };
    inApp: {
        enabled: boolean;
        types?: string[];
    };
    sound: {
        enabled: boolean;
        types?: string[];
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
    defaultMeetingDuration: number;
    dailyMeetingLimit?: DailyMeetingLimitConfig;
}
/**
 * Working Hours Configuration
 *
 * Define horário de trabalho para um dia específico
 */
export interface WorkingHoursConfig {
    enabled: boolean;
    start: string;
    end: string;
}
/**
 * Break Configuration
 *
 * Pausas durante o dia (almoço, café, etc.)
 */
export interface BreakConfig {
    name: string;
    start: string;
    end: string;
    daysOfWeek: number[];
    enabled: boolean;
}
/**
 * Blocked Date Configuration
 *
 * Datas específicas bloqueadas (férias, eventos pessoais)
 */
export interface BlockedDateConfig {
    startDate: string;
    endDate: string;
    reason?: string;
    allDay: boolean;
    startTime?: string;
    endTime?: string;
}
/**
 * Holidays Configuration
 *
 * Configuração de feriados nacionais/regionais
 */
export interface HolidaysConfig {
    enabled: boolean;
    country: string;
    region?: string;
    customHolidays: CustomHoliday[];
}
/**
 * Custom Holiday
 *
 * Feriado customizado pelo usuário
 */
export interface CustomHoliday {
    date: string;
    name: string;
    recurring: boolean;
}
/**
 * Meeting Buffer Configuration
 *
 * Tempo de buffer entre reuniões (para preparação/deslocamento)
 */
export interface MeetingBufferConfig {
    enabled: boolean;
    minutes: number;
}
/**
 * Daily Meeting Limit Configuration
 *
 * Limite máximo de reuniões por dia
 */
export interface DailyMeetingLimitConfig {
    enabled: boolean;
    maxMeetings: number;
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
    levelId?: ObjectId;
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
    levelId?: string;
    preferences?: Partial<UserPreferences>;
    sendInvite?: boolean;
}
export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    status?: ActiveStatus;
    levelId?: string;
    preferences?: Partial<UserPreferences>;
    password?: string;
}
export interface CreateUserInvitationRequest {
    email: string;
    firstName: string;
    lastName: string;
    levelId?: string;
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
    device?: {
        deviceId: string;
        platform: 'web' | 'android' | 'ios';
        browser?: string;
        deviceModel?: string;
    };
}
export interface LoginResponse {
    user: UserResponse;
    token: string;
    refreshToken?: string;
    expiresAt: Date;
    requiresTwoFactor?: boolean;
    companyName: string;
    masterLogin?: boolean;
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
export interface UserQuery extends PaginationQuery {
    status?: ActiveStatus;
    levelId?: string;
    teamId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    companyId?: string;
}
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
    level?: LevelResponse | null;
    levelName?: string | null;
    teams?: Array<{
        id: string;
        name: string;
    }>;
    preferences: UserPreferences;
    permissions: UserPermissions;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    lastLoginAt?: string;
    lastActivityAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface UserListResponse extends ListResponse<UserResponse> {
}
export interface UserQueryOptions extends GenericQueryOptions<UserQuery> {
}

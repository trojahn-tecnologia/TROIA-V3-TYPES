/**
 * Alertas de inatividade de leads — config por funil/etapa + resultado computado.
 *
 * Dois "relógios" independentes classificam cada lead:
 *  - inactivity: dias desde a última atividade (só p/ lead SEM próxima agendada)
 *  - timeInStep: dias desde a entrada na etapa atual
 *
 * A cor final (borda do card no kanban) sobrepõe as regras atuais de atividade
 * (no_activities → critical, overdue → warning). Ver spec §4.
 */
export type AlertLevel = 'ok' | 'warning' | 'critical' | 'snoozed';
/** Um "relógio" de tempo com 2 limiares (dias). criticalDays > warningDays >= 1. */
export interface AlertClockConfig {
    enabled: boolean;
    warningDays: number;
    criticalDays: number;
}
export interface AlertNotificationsConfig {
    onWarning: boolean;
    onCritical: boolean;
    weeklyDigest: boolean;
}
/** Clocks opcionais = herdam do nível acima (etapa → funil → sistema). */
export interface AlertConfig {
    inactivity?: AlertClockConfig;
    timeInStep?: AlertClockConfig;
    /** Persistido agora; o disparo real das notificações é fase diferida (depende de "gestor"). */
    notifications?: AlertNotificationsConfig;
}
export type AlertReasonClock = 'no_activities' | 'overdue' | 'inactivity' | 'timeInStep';
export type AlertThresholdSource = 'step' | 'funnel' | 'system';
/** Motivo governante da cor — alimenta o tooltip no card. */
export interface AlertReason {
    clock: AlertReasonClock;
    days?: number;
    thresholdDays?: number;
    source?: AlertThresholdSource;
}
/** Default do sistema aplicado a funis/etapas sem config (dia 0). */
export declare const SYSTEM_ALERT_DEFAULTS: {
    inactivity: AlertClockConfig;
    timeInStep: AlertClockConfig;
};

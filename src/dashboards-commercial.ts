export type DashboardPeriodMode = 'week' | 'month' | 'year' | 'custom';

export interface CommercialDashboardQuery {
  period: DashboardPeriodMode;
  /** Required when period='month' or 'year'. */
  year?: number;
  /** Required when period='month'. */
  month?: number;
  /** Required when period='custom'. ISO date YYYY-MM-DD. */
  startDate?: string;
  /** Required when period='custom'. ISO date YYYY-MM-DD. */
  endDate?: string;
}

export interface KpiValue {
  value: number;
  deltaPct: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface GoalSummary {
  target: number;
  achieved: number;
  achievedPct: number;
  remaining: number;
  daysRemaining: number;
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
}

export interface RevenueChart {
  points: RevenueChartPoint[];
  target: number;
}

export interface PeriodComparisonItem {
  label: string;
  revenue: number;
  isCurrent: boolean;
}

export interface TeamActivityCounter {
  value: number;
  deltaPct: number;
}

export interface TeamMeetingsCounter extends TeamActivityCounter {
  noShowPct: number;
}

export interface TeamActivitiesSummary {
  calls: TeamActivityCounter;
  emails: TeamActivityCounter;
  messages: TeamActivityCounter;
  meetings: TeamMeetingsCounter;
}

export interface TopPerformer {
  userId: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  revenue: number;
  deals: number;
  conversionRate: number;
  goalPct: number | null;
}

export interface ScorecardActivities {
  calls: number;
  emails: number;
  messages: number;
  meetings: number;
  /** Soma de calls + emails + messages + meetings (atividades totais do user no período). */
  total: number;
}

export interface ScorecardRow {
  userId: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  /** Total de leads atribuídos ao user no período (qualquer status). */
  leads: number;
  revenue: number;
  deals: number;
  conversionRate: number;
  avgTicket: number;
  activities: ScorecardActivities;
  goalPct: number | null;
}

export interface WeeklyHeatmapDay {
  dayOfWeek: 1 | 2 | 3 | 4 | 5;
  revenue: number;
}

export interface WeeklyHeatmapWeek {
  weekStart: string;
  days: WeeklyHeatmapDay[];
  total: number;
}

export interface TopCampaign {
  campaignName: string;
  leads: number;
  won: number;
  revenue: number;
  conversionRate: number;
  deltaPct: number;
}

export interface CommercialDashboardResponse {
  period: {
    type: DashboardPeriodMode;
    start: string;
    end: string;
    label: string;
  };
  kpis: {
    revenue: KpiValue;
    deals: KpiValue;
    avgTicket: KpiValue;
    conversionRate: KpiValue;
  };
  goal: GoalSummary | null;
  revenueChart: RevenueChart;
  comparison: PeriodComparisonItem[];
  teamActivities: TeamActivitiesSummary;
  topPerformers: TopPerformer[];
  scorecard: ScorecardRow[];
  weeklyHeatmap: WeeklyHeatmapWeek[];
  topCampaigns: TopCampaign[];
}

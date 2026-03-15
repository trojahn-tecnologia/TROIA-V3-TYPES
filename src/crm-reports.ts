// CRM Reports - Analytics and reporting for CRM module

// ============================================================================
// DATE RANGE FILTERS
// ============================================================================

export interface DateRangeFilter {
  startDate: string;     // ISO date string
  endDate: string;       // ISO date string
}

// ============================================================================
// FUNNEL ANALYTICS (Using stepsHistory)
// ============================================================================

export interface FunnelAnalyticsRequest extends DateRangeFilter {
  funnelId?: string;     // Filter by specific funnel
  stepId?: string;       // Filter by specific step
  assigneeId?: string;   // Filter by assignee
  teamId?: string;       // Filter by team
}

export interface StepConversion {
  stepId: string;
  stepName: string;
  leadsEntered: number;          // Total leads that entered this step
  leadsExited: number;           // Total leads that exited this step
  leadsInProgress: number;       // Current leads in this step
  avgDurationMs: number;         // Average time spent in step (milliseconds)
  avgDurationDays: number;       // Average time spent in step (days)
  conversionRate: number;        // Percentage of leads that moved to next step
}

export interface FunnelAnalyticsResponse {
  funnelId: string;
  funnelName: string;
  totalLeads: number;            // Total leads in this funnel
  leadsWon: number;              // Leads with businessStatus = 'won'
  leadsLost: number;             // Leads with businessStatus = 'lost'
  leadsInProgress: number;       // Leads with businessStatus = 'pending'
  overallConversionRate: number; // Won / Total
  totalValue: number;            // Sum of wonValue for won leads
  avgCycleTimeMs: number;        // Average time from first step to won/lost
  avgCycleTimeDays: number;      // Average cycle time in days
  steps: StepConversion[];       // Conversion data per step
}

// ============================================================================
// LEAD CONVERSION REPORT
// ============================================================================

export interface LeadConversionRequest extends DateRangeFilter {
  funnelId?: string;
  assigneeId?: string;
  teamId?: string;
  source?: string;
  medium?: string;
  origin?: string;
}

export interface LeadConversionByPeriod {
  period: string;         // Date string (YYYY-MM-DD or YYYY-MM or YYYY)
  totalLeads: number;
  leadsWon: number;
  leadsLost: number;
  leadsInProgress: number;
  totalValue: number;
  conversionRate: number; // Won / Total
}

export interface LeadConversionResponse {
  summary: {
    totalLeads: number;
    leadsWon: number;
    leadsLost: number;
    leadsInProgress: number;
    totalValue: number;
    avgValue: number;
    conversionRate: number;
    lossRate: number;
  };
  byPeriod: LeadConversionByPeriod[];
  bySource: Array<{
    source: string;
    count: number;
    won: number;
    lost: number;
    value: number;
    conversionRate: number;
  }>;
  byChannel: Array<{
    channel: string;
    count: number;
    won: number;
    lost: number;
    value: number;
    conversionRate: number;
  }>;
  topLostReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

// ============================================================================
// ACTIVITY REPORT (Using dueDate for overdue tracking)
// ============================================================================

export interface ActivityReportRequest extends DateRangeFilter {
  entityType?: 'lead' | 'contact' | 'customer' | 'ticket' | 'conversation';
  entityId?: string;
  actorId?: string;
  status?: 'completed' | 'in_progress' | 'pending' | 'failed' | 'cancelled';
  isOverdue?: boolean;
}

export interface ActivityReportResponse {
  summary: {
    totalActivities: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
    completionRate: number;
    overdueRate: number;
  };
  byType: Array<{
    type: string;
    count: number;
    completed: number;
    overdue: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    completed: number;
    overdue: number;
  }>;
  byActor: Array<{
    actorId: string;
    actorName?: string;
    totalActivities: number;
    completed: number;
    overdue: number;
    completionRate: number;
  }>;
  upcomingDue: Array<{
    id: string;
    title: string;
    entityType: string;
    entityId: string;
    dueDate: string;
    daysUntilDue: number;
  }>;
  overdueActivities: Array<{
    id: string;
    title: string;
    entityType: string;
    entityId: string;
    dueDate: string;
    daysOverdue: number;
    actorId?: string;
    actorName?: string;
  }>;
}

// ============================================================================
// TEAM PERFORMANCE REPORT
// ============================================================================

export interface TeamPerformanceRequest extends DateRangeFilter {
  teamId?: string;
  assigneeId?: string;
}

export interface TeamMemberPerformance {
  userId: string;
  userName: string;
  teamId?: string;
  teamName?: string;
  metrics: {
    totalLeads: number;
    leadsWon: number;
    leadsLost: number;
    conversionRate: number;
    totalValue: number;
    avgValue: number;
    activitiesCompleted: number;
    activitiesOverdue: number;
    avgResponseTimeMs?: number;   // If tracking response times
    avgCycleTimeMs?: number;      // Average time to close leads
  };
}

export interface TeamPerformanceResponse {
  summary: {
    totalMembers: number;
    totalLeads: number;
    totalValue: number;
    avgConversionRate: number;
    avgCycleTimeDays: number;
  };
  members: TeamMemberPerformance[];
  topPerformers: TeamMemberPerformance[];   // Top 5 by conversion rate
  needsImprovement: TeamMemberPerformance[]; // Bottom 5 by conversion rate
}

// ============================================================================
// DASHBOARD SUMMARY
// ============================================================================

export interface CRMDashboardRequest extends DateRangeFilter {
  funnelId?: string;
  teamId?: string;
}

export interface CRMDashboardResponse {
  leads: {
    total: number;
    new: number;
    inProgress: number;
    won: number;
    lost: number;
    conversionRate: number;
    totalValue: number;
    trend: {
      previousPeriod: number;
      change: number;           // Percentage change
      direction: 'up' | 'down' | 'stable';
    };
  };
  activities: {
    total: number;
    completed: number;
    overdue: number;
    pending: number;
    completionRate: number;
    overdueRate: number;
  };
  funnels: Array<{
    id: string;
    name: string;
    leadsCount: number;
    value: number;
    conversionRate: number;
  }>;
  recentLeads: Array<{
    id: string;
    contactName: string;
    segment: string;
    status: string;
    businessStatus: string;
    value?: number;
    createdAt: string;
  }>;
}

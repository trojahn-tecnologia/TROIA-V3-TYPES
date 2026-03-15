export interface DateRangeFilter {
    startDate: string;
    endDate: string;
}
export interface FunnelAnalyticsRequest extends DateRangeFilter {
    funnelId?: string;
    stepId?: string;
    assigneeId?: string;
    teamId?: string;
}
export interface StepConversion {
    stepId: string;
    stepName: string;
    leadsEntered: number;
    leadsExited: number;
    leadsInProgress: number;
    avgDurationMs: number;
    avgDurationDays: number;
    conversionRate: number;
}
export interface FunnelAnalyticsResponse {
    funnelId: string;
    funnelName: string;
    totalLeads: number;
    leadsWon: number;
    leadsLost: number;
    leadsInProgress: number;
    overallConversionRate: number;
    totalValue: number;
    avgCycleTimeMs: number;
    avgCycleTimeDays: number;
    steps: StepConversion[];
}
export interface LeadConversionRequest extends DateRangeFilter {
    funnelId?: string;
    assigneeId?: string;
    teamId?: string;
    source?: string;
    medium?: string;
    origin?: string;
}
export interface LeadConversionByPeriod {
    period: string;
    totalLeads: number;
    leadsWon: number;
    leadsLost: number;
    leadsInProgress: number;
    totalValue: number;
    conversionRate: number;
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
        avgResponseTimeMs?: number;
        avgCycleTimeMs?: number;
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
    topPerformers: TeamMemberPerformance[];
    needsImprovement: TeamMemberPerformance[];
}
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
            change: number;
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

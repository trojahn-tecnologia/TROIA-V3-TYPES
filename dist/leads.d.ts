export interface StepHistoryEntry {
    stepId: string;
    stepName?: string;
    funnelId?: string;
    funnelName?: string;
    enteredAt: string;
    exitedAt?: string;
    movedBy?: string;
    movedByName?: string;
    duration?: number;
}
export interface Lead {
    id: string;
    appId: string;
    companyId: string;
    contactId: string;
    score: number;
    segment: string;
    description?: string;
    source?: 'webhook' | 'conversation' | 'ai-conversation' | 'manual' | 'api';
    origin?: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'email' | 'website' | 'phone' | 'referral' | 'other';
    channelId?: string;
    status: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    temperature: 'cold' | 'warm' | 'hot';
    qualifyStatus: 'pending' | 'qualified' | 'disqualified';
    funnelId?: string;
    stepId?: string;
    stepsHistory?: StepHistoryEntry[];
    assigneeId?: string;
    teamId?: string;
    assignmentType?: string;
    assignedAt?: string;
    assignedBy?: string;
    budget?: number;
    wonValue?: number;
    businessStatus?: 'pending' | 'won' | 'lost';
    wonDate?: string;
    activityStatus?: 'no_activities' | 'overdue' | 'up_to_date';
    customerId?: string;
    lostDate?: string;
    lastInteractionAt?: string;
    lastFollowUpAt?: string;
    lastStepAt?: string;
    lastActivityAt?: string;
    lostReason?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateLeadRequest {
    contactId?: string;
    score?: number;
    segment: string;
    description?: string;
    source?: 'webhook' | 'conversation' | 'ai-conversation' | 'manual' | 'api';
    origin?: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'email' | 'website' | 'phone' | 'referral' | 'other';
    channelId?: string;
    status?: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    temperature?: 'cold' | 'warm' | 'hot';
    qualifyStatus?: 'pending' | 'qualified' | 'disqualified';
    funnelId?: string;
    stepId?: string;
    assigneeId?: string;
    teamId?: string;
    budget?: number;
    name?: string;
    company?: string;
    position?: string;
    emails?: string[];
    phones?: string[];
}
export interface UpdateLeadRequest {
    contactId?: string;
    score?: number;
    segment?: string;
    description?: string;
    source?: 'webhook' | 'conversation' | 'ai-conversation' | 'manual' | 'api';
    origin?: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'email' | 'website' | 'phone' | 'referral' | 'other';
    channelId?: string;
    status?: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    temperature?: 'cold' | 'warm' | 'hot';
    qualifyStatus?: 'pending' | 'qualified' | 'disqualified';
    funnelId?: string;
    stepId?: string;
    stepName?: string;
    funnelName?: string;
    movedBy?: string;
    movedByName?: string;
    assigneeId?: string;
    teamId?: string;
    budget?: number;
    wonValue?: number;
    businessStatus?: 'pending' | 'won' | 'lost';
    wonDate?: string;
    lostDate?: string;
    customerId?: string;
    lostReason?: string;
    lastInteractionAt?: string;
    lastFollowUpAt?: string;
    lastStepAt?: string;
}
export interface LeadResponse extends Lead {
    contact?: {
        id: string;
        name: string;
        picture?: string;
        tags?: string[];
        identifiers?: {
            email?: string[];
            phone?: string[];
            whatsapp?: string[];
            instagram?: string[];
            facebook?: string[];
            telegram?: string[];
        };
    };
    assignee?: {
        id: string;
        name: string;
        email: string;
    };
    customer?: {
        id: string;
        name: string;
    };
    channel?: {
        id: string;
        name: string;
    };
    step?: {
        id: string;
        name: string;
    };
    funnel?: {
        id: string;
        name: string;
    };
}
export interface LeadQuery extends PaginationQuery {
    filters?: {
        contactId?: string;
        segment?: string | string[];
        source?: ('webhook' | 'conversation' | 'ai-conversation' | 'manual' | 'api') | ('webhook' | 'conversation' | 'ai-conversation' | 'manual' | 'api')[];
        origin?: ('whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'email' | 'website' | 'phone' | 'referral' | 'other') | ('whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'email' | 'website' | 'phone' | 'referral' | 'other')[];
        suborigin?: string | string[];
        channelId?: string | string[];
        status?: ('new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost') | ('new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost')[];
        priority?: ('low' | 'medium' | 'high' | 'urgent') | ('low' | 'medium' | 'high' | 'urgent')[];
        temperature?: ('cold' | 'warm' | 'hot') | ('cold' | 'warm' | 'hot')[];
        qualifyStatus?: ('pending' | 'qualified' | 'disqualified') | ('pending' | 'qualified' | 'disqualified')[];
        businessStatus?: ('pending' | 'won' | 'lost') | ('pending' | 'won' | 'lost')[];
        funnelId?: string | string[];
        stepId?: string | string[];
        assigneeId?: string | string[];
        teamId?: string | string[];
        customerId?: string;
        scoreMin?: number;
        scoreMax?: number;
        budgetMin?: number;
        budgetMax?: number;
        dateFrom?: string;
        dateTo?: string;
        campaignName?: string | string[];
        adsetName?: string | string[];
        adName?: string | string[];
        tags?: string | string[];
    };
}
export interface LeadListResponse extends ListResponse<LeadResponse> {
}
export interface ConvertLeadRequest {
    customerId: string;
    wonValue?: number;
    conversionNotes?: string;
}
export interface AssignLeadRequest {
    assigneeId?: string;
    teamId?: string;
    assignmentType?: string;
}
import { PaginationQuery, ListResponse } from './common';

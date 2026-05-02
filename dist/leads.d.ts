/** Plataforma/origem de marketing do lead (espelha campos UTM). */
export declare const LEAD_SOURCES: readonly ["meta", "google", "tiktok", "linkedin", "microsoft", "organic", "referral", "email", "offline", "partner", "outbound", "direct"];
export type LeadSource = typeof LEAD_SOURCES[number];
/** Tipo de tráfego (orgânico vs pago). */
export declare const LEAD_MEDIUMS: readonly ["organic", "paid"];
export type LeadMedium = typeof LEAD_MEDIUMS[number];
/** Sub-canal semântico de captura (NÃO confundir com Channel collection / channelId). */
export declare const LEAD_CHANNELS: readonly ["whatsapp", "instagram", "facebook", "messenger", "telegram", "email", "website", "phone", "google", "youtube", "tiktok", "linkedin", "bing", "other"];
export type LeadChannel = typeof LEAD_CHANNELS[number];
/** Labels pt-BR canônicos por enum — único lugar onde a string é definida. */
export declare const LEAD_SOURCE_LABELS: Record<LeadSource, string>;
export declare const LEAD_MEDIUM_LABELS: Record<LeadMedium, string>;
export declare const LEAD_CHANNEL_LABELS: Record<LeadChannel, string>;
/** Helpers — retornam label canônico ou o próprio valor (defensivo contra valores legacy). */
export declare const getLeadSourceLabel: (s: string) => string;
export declare const getLeadMediumLabel: (m: string) => string;
export declare const getLeadChannelLabel: (c: string) => string;
/** Type guards. */
export declare const isLeadSource: (v: string) => v is LeadSource;
export declare const isLeadMedium: (v: string) => v is LeadMedium;
export declare const isLeadChannel: (v: string) => v is LeadChannel;
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
    source?: LeadSource;
    medium?: LeadMedium;
    channel?: LeadChannel;
    channelId?: string;
    type?: string;
    status: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost' | (string & {});
    priority: 'low' | 'medium' | 'high' | 'urgent' | (string & {});
    temperature: 'cold' | 'warm' | 'hot' | (string & {});
    qualifyStatus: 'pending' | 'qualified' | 'disqualified' | (string & {});
    /** Timestamp do último change em qualifyStatus — usado por métricas de qualificação no dashboard. */
    qualifyStatusChangedAt?: Date | string;
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
    origin?: string;
    campaignName?: string;
    adsetName?: string;
    adName?: string;
    formId?: string;
    externalLeadId?: string;
    pageId?: string;
    pageName?: string;
    lostReason?: string;
    interests?: LeadInterest[];
    createdAt: string;
    updatedAt: string;
}
export interface CreateLeadRequest {
    contactId?: string;
    score?: number;
    segment: string;
    description?: string;
    source?: LeadSource;
    medium?: LeadMedium;
    channel?: LeadChannel;
    channelId?: string;
    type?: string;
    status?: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost' | (string & {});
    priority?: 'low' | 'medium' | 'high' | 'urgent' | (string & {});
    temperature?: 'cold' | 'warm' | 'hot' | (string & {});
    qualifyStatus?: 'pending' | 'qualified' | 'disqualified' | (string & {});
    funnelId?: string;
    stepId?: string;
    assigneeId?: string;
    teamId?: string;
    budget?: number;
    origin?: string;
    campaignName?: string;
    adsetName?: string;
    adName?: string;
    formId?: string;
    externalLeadId?: string;
    pageId?: string;
    pageName?: string;
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
    source?: LeadSource;
    medium?: LeadMedium;
    channel?: LeadChannel;
    channelId?: string;
    type?: string;
    status?: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost' | (string & {});
    priority?: 'low' | 'medium' | 'high' | 'urgent' | (string & {});
    temperature?: 'cold' | 'warm' | 'hot' | (string & {});
    qualifyStatus?: 'pending' | 'qualified' | 'disqualified' | (string & {});
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
    origin?: string;
    campaignName?: string;
    adsetName?: string;
    adName?: string;
    formId?: string;
    externalLeadId?: string;
    pageId?: string;
    pageName?: string;
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
    channelConfig?: {
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
        source?: LeadSource | LeadSource[];
        medium?: LeadMedium | LeadMedium[];
        channel?: LeadChannel | LeadChannel[];
        origin?: string | string[];
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
        type?: string | string[];
        contactIdIn?: string[];
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
export interface LeadInterest {
    documentId: string;
    status: 'pending' | 'approved';
    addedAt?: string;
}
export interface AddLeadInterestsRequest {
    documentIds: string[];
}
import { PaginationQuery, ListResponse } from './common';

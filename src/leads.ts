// Lead Types - Sales system with universal source

// Step history entry for tracking funnel movement
export interface StepHistoryEntry {
  stepId: string;
  stepName?: string;     // Denormalized for display without lookup
  funnelId?: string;     // Optional - lead might be moved without explicit funnel
  funnelName?: string;   // Denormalized for display without lookup
  enteredAt: string;     // When the lead entered this step
  exitedAt?: string;     // When the lead exited (null if current step)
  movedBy?: string;      // userId who moved the lead (for audit)
  movedByName?: string;  // User name who moved the lead (for display)
  duration?: number;     // Time spent in this step (milliseconds) - calculated when exitedAt is set
}

export interface Lead {
  id: string;
  appId: string;
  companyId: string;

  // Base relationship
  contactId: string;

  // Basic data
  score: number;
  segment: string;
  description?: string;

  // Marketing attribution: source → channel → origin
  source?: 'meta' | 'google' | 'tiktok' | 'linkedin' | 'microsoft' | 'organic' | 'referral' | 'email' | 'offline' | 'partner' | 'outbound' | 'direct';
  medium?: 'organic' | 'paid';
  channel?: 'whatsapp' | 'instagram' | 'facebook' | 'messenger' | 'telegram' | 'email' | 'website' | 'phone' | 'google' | 'youtube' | 'tiktok' | 'linkedin' | 'bing' | 'other';
  channelId?: string;

  // User-defined classification
  type?: string;

  // Status and temperature
  status: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  temperature: 'cold' | 'warm' | 'hot';
  qualifyStatus: 'pending' | 'qualified' | 'disqualified';

  // Sales funnel
  funnelId?: string;
  stepId?: string;
  stepsHistory?: StepHistoryEntry[]; // History of all step changes for funnel analytics

  // Assignment (standard assignments pattern)
  assigneeId?: string;
  teamId?: string;
  assignmentType?: string;
  assignedAt?: string;
  assignedBy?: string;

  // Financial
  budget?: number;
  wonValue?: number;

  // Business outcome
  businessStatus?: 'pending' | 'won' | 'lost';
  wonDate?: string;

  // Activity tracking (calculated by backend based on activities)
  // no_activities: No activities registered (red/problem)
  // overdue: Has pending activities past their occurredAt date (orange/warning)
  // up_to_date: All activities completed or pending with future dates (green/success)
  activityStatus?: 'no_activities' | 'overdue' | 'up_to_date';

  // Control dates
  customerId?: string;        // Renamed from convertedToCustomerId
  lostDate?: string;
  lastInteractionAt?: string;
  lastFollowUpAt?: string;
  lastStepAt?: string;
  lastActivityAt?: string;

  // Origin (free-text classification)
  origin?: string;

  // Campaign/Ad tracking
  campaignName?: string;
  adsetName?: string;
  adName?: string;

  // External tracking (from public endpoint / webhooks)
  formId?: string;
  externalLeadId?: string;
  pageId?: string;
  pageName?: string;

  // Loss/disqualification reasons
  lostReason?: string;

  // Interests - Database documents the lead is interested in
  interests?: LeadInterest[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  contactId?: string;  // ✅ OPTIONAL: will be created from name/emails/phones if not provided
  score?: number;
  segment: string;
  description?: string;
  source?: 'meta' | 'google' | 'tiktok' | 'linkedin' | 'microsoft' | 'organic' | 'referral' | 'email' | 'offline' | 'partner' | 'outbound' | 'direct';
  medium?: 'organic' | 'paid';
  channel?: 'whatsapp' | 'instagram' | 'facebook' | 'messenger' | 'telegram' | 'email' | 'website' | 'phone' | 'google' | 'youtube' | 'tiktok' | 'linkedin' | 'bing' | 'other';
  channelId?: string;
  type?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  temperature?: 'cold' | 'warm' | 'hot';
  qualifyStatus?: 'pending' | 'qualified' | 'disqualified';
  funnelId?: string;
  stepId?: string;
  assigneeId?: string;
  teamId?: string;
  budget?: number;

  // Origin (free-text)
  origin?: string;

  // Campaign/Ad tracking
  campaignName?: string;
  adsetName?: string;
  adName?: string;

  // External tracking
  formId?: string;
  externalLeadId?: string;
  pageId?: string;
  pageName?: string;

  // ✅ NEW: Contact data for automatic contact creation (if contactId not provided)
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
  source?: 'meta' | 'google' | 'tiktok' | 'linkedin' | 'microsoft' | 'organic' | 'referral' | 'email' | 'offline' | 'partner' | 'outbound' | 'direct';
  medium?: 'organic' | 'paid';
  channel?: 'whatsapp' | 'instagram' | 'facebook' | 'messenger' | 'telegram' | 'email' | 'website' | 'phone' | 'google' | 'youtube' | 'tiktok' | 'linkedin' | 'bing' | 'other';
  channelId?: string;
  type?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  temperature?: 'cold' | 'warm' | 'hot';
  qualifyStatus?: 'pending' | 'qualified' | 'disqualified';
  funnelId?: string;
  stepId?: string;
  // Optional fields for step history tracking (denormalized data)
  stepName?: string;          // Denormalized step name for stepsHistory
  funnelName?: string;        // Denormalized funnel name for stepsHistory
  movedBy?: string;           // User ID who moved the lead (for audit)
  movedByName?: string;       // User name who moved the lead (for display)
  assigneeId?: string;
  teamId?: string;
  budget?: number;
  wonValue?: number;
  businessStatus?: 'pending' | 'won' | 'lost';
  wonDate?: string;
  lostDate?: string;
  // activityStatus is calculated automatically by backend - not updatable
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
  // Populated relationships (from aggregation lookups)
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
    segment?: string | string[];                                                                                                    // Multiple selection
    source?: ('meta' | 'google' | 'tiktok' | 'linkedin' | 'microsoft' | 'organic' | 'referral' | 'email' | 'offline' | 'partner' | 'outbound' | 'direct') | ('meta' | 'google' | 'tiktok' | 'linkedin' | 'microsoft' | 'organic' | 'referral' | 'email' | 'offline' | 'partner' | 'outbound' | 'direct')[];
    medium?: ('organic' | 'paid') | ('organic' | 'paid')[];
    channel?: ('whatsapp' | 'instagram' | 'facebook' | 'messenger' | 'telegram' | 'email' | 'website' | 'phone' | 'google' | 'youtube' | 'tiktok' | 'linkedin' | 'bing' | 'other') | ('whatsapp' | 'instagram' | 'facebook' | 'messenger' | 'telegram' | 'email' | 'website' | 'phone' | 'google' | 'youtube' | 'tiktok' | 'linkedin' | 'bing' | 'other')[];
    origin?: string | string[];
    channelId?: string | string[];                                                                                                  // Multiple selection
    status?: ('new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost') | ('new' | 'contacted' | 'qualified' | 'disqualified' | 'converted' | 'lost')[];
    priority?: ('low' | 'medium' | 'high' | 'urgent') | ('low' | 'medium' | 'high' | 'urgent')[];
    temperature?: ('cold' | 'warm' | 'hot') | ('cold' | 'warm' | 'hot')[];
    qualifyStatus?: ('pending' | 'qualified' | 'disqualified') | ('pending' | 'qualified' | 'disqualified')[];                    // Default: ['pending', 'qualified']
    businessStatus?: ('pending' | 'won' | 'lost') | ('pending' | 'won' | 'lost')[];                                               // Default: ['pending', 'won']
    funnelId?: string | string[];                                                                                                   // Multiple selection
    stepId?: string | string[];                                                                                                     // Multiple selection
    assigneeId?: string | string[];                                                                                                 // Multiple selection
    teamId?: string | string[];                                                                                                     // Multiple selection
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

export interface LeadListResponse extends ListResponse<LeadResponse> {}

// Lead conversion
export interface ConvertLeadRequest {
  customerId: string;
  wonValue?: number;
  conversionNotes?: string;
}

// Lead assignment
export interface AssignLeadRequest {
  assigneeId?: string;
  teamId?: string;
  assignmentType?: string;
}

// Lead interests
export interface LeadInterest {
  documentId: string;
  status: 'pending' | 'approved';
  addedAt?: string;
}

export interface AddLeadInterestsRequest {
  documentIds: string[];
}

// Import types
import { PaginationQuery, ListResponse } from './common';
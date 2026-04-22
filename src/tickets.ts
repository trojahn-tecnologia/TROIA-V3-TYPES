// Ticket Types - Sistema de atendimento com SLA
import { TicketStatusCategory } from './ticket-pipelines';

export interface Ticket {
  id: string;
  appId: string;
  companyId: string;

  // Core ticket data
  ticketNumber: string;  // Auto-generated: TCK-YYYY-NNNNNN
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];

  // Pipeline system
  pipelineId: string;
  stageId: string;
  statusCategory: TicketStatusCategory;

  // Customer/Contact relationship
  customerId?: string;
  contactId?: string;

  // Lead relationship (if ticket came from lead)
  leadId?: string;

  // Assignment system integration
  assigneeId?: string;
  teamId?: string;
  assignmentType?: string;
  assignedAt?: string;
  assignedBy?: string;

  // SLA Management
  slaBreachTime?: string;  // When SLA will be breached
  slaBreached?: boolean;   // If SLA was breached
  responseTime?: number;   // Response time in minutes
  resolutionTime?: number; // Resolution time in minutes

  // Communication
  conversationId?: string; // Associated conversation
  channelId?: string;      // Channel where ticket originated
  source?: string;         // Universal source (email, whatsapp, etc.)

  // Dates and timeline
  firstResponseAt?: string;
  lastResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  dueDate?: string;
  /**
   * ISO string do valor de `dueDate` para o qual já foi enviado o
   * alerta de vencimento (24h antes). Usado para idempotência: se o
   * `dueDate` for editado, este campo fica diferente do novo valor e o
   * ticket volta a ser elegível para alerta. Campo interno — não aceito
   * em CreateTicketRequest/UpdateTicketRequest.
   */
  dueDateAlertSentFor?: string;

  // Internal notes and resolution
  internalNotes?: string;
  resolutionSummary?: string;
  customerSatisfaction?: number; // 1-5 rating

  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags?: string[];
  pipelineId?: string;
  stageId?: string;
  customerId?: string;
  contactId?: string;
  leadId?: string;
  assigneeId?: string;
  teamId?: string;
  conversationId?: string;
  channelId?: string;
  source?: string;
  dueDate?: string;
  internalNotes?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: string;
  statusReason?: string;
  resolution?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  tags?: string[];
  stageId?: string;
  customerId?: string;
  contactId?: string;
  leadId?: string;
  assigneeId?: string;
  teamId?: string;
  dueDate?: string;
  internalNotes?: string;
  resolutionSummary?: string;
  customerSatisfaction?: number;
}

export type TicketResponse = Ticket;

export interface TicketQuery extends PaginationQuery {
  filters?: {
    title?: string;
    status?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    tags?: string[];
    pipelineId?: string;
    stageId?: string;
    statusCategory?: TicketStatusCategory;
    customerId?: string;
    contactId?: string;
    leadId?: string;
    assigneeId?: string;
    teamId?: string;
    channelId?: string;
    source?: string;
    slaBreached?: boolean;
    createdFrom?: string;
    createdTo?: string;
    dueFrom?: string;
    dueTo?: string;
    resolvedFrom?: string;
    resolvedTo?: string;
  };
}

export interface TicketListResponse extends ListResponse<TicketResponse> {}

// Ticket assignment
export interface AssignTicketRequest {
  assigneeId?: string;
  teamId?: string;
  assignmentType?: string;
  reason?: string;
}

// Ticket resolution
export interface ResolveTicketRequest {
  resolutionSummary: string;
  internalNotes?: string;
  customerSatisfaction?: number;
}

// Ticket SLA tracking
export interface TicketSLA {
  ticketId: string;
  responseTimeSLA: number;    // Minutes
  resolutionTimeSLA: number;  // Minutes
  breachTime: string;         // When breach will occur
  breached: boolean;
  actualResponseTime?: number;
  actualResolutionTime?: number;
}

// Export query — subset de TicketQuery sem paginação
export interface TicketExportQuery {
  pipelineId?: string;
  stageId?: string;
  assigneeId?: string;
  assigneeIds?: string[];
  teamId?: string;
  status?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  tags?: string[];
  slaBreached?: boolean;
  channelId?: string;
  contactId?: string;
  customerId?: string;
  createdFrom?: string;
  createdTo?: string;
  dueFrom?: string;
  dueTo?: string;
  resolvedFrom?: string;
  resolvedTo?: string;
  search?: string;
}

// Import types
import { PaginationQuery, ListResponse } from './common';
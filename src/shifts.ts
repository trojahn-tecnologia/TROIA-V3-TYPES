import { ObjectId } from 'mongodb';
import { PaginationQuery, ListResponse, GenericQueryOptions, ActiveStatus } from './common';
import type { DistributionConfig } from './distribution';

// ============================================================================
// SHIFTS TYPES
// ============================================================================

export interface Shift {
  name: string;
  description?: string;
  teamId?: ObjectId; // Optional team assignment
  schedule: ShiftSchedule;
  assignments: ShiftAssignment[];
  assignmentConfig: DistributionConfig;
  userAvailability: UserAvailability[]; // User availability within this shift
  workloadConfig?: WorkloadConfig; // Workload limits for this shift
  companyId: ObjectId;
  appId: ObjectId;
  status: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Shift schedule — always fixed pattern.
 *
 * Simplificado: removido `type` (`rotating`/`on_demand` nunca foram
 * implementados). O schedule é sempre fixo: weekdays + startTime + endTime
 * + timezone. `overlapMinutes` e `transitionStrategy` mantidos para
 * futuras otimizações de handoff.
 */
export interface ShiftSchedule {
  weekdays: number[];   // [0,1,2,3,4,5,6] = Sun-Sat
  startTime: string;    // "08:00"
  endTime: string;      // "18:00"
  timezone: string;     // "America/Sao_Paulo"
  overlapMinutes?: number;
  transitionStrategy?: 'immediate' | 'finish_current' | 'overlap';
}

export interface ShiftAssignment {
  userId: ObjectId;
  role: 'primary' | 'backup';
  priority: number; // 1=highest priority within role
  customSchedule?: {
    startDate: Date;
    endDate?: Date;
    weekdays?: number[];
    startTime?: string;
    endTime?: string;
  };
  status: 'active' | 'inactive' | 'vacation' | 'sick_leave';
  assignedAt: Date;
}

export interface UserAvailability {
  id?: string;
  userId: ObjectId;
  currentStatus: 'available' | 'busy' | 'away' | 'offline';
  currentShift?: {
    shiftId: ObjectId;
    startedAt: Date;
    expectedEndAt: Date;
  };
  currentWorkload: {
    activeChats: number;
    activeLeads: number;
    activeTickets: number;
    totalScore: number; // Weighted workload score
  };
  lastActivity: Date;
  lastAssignment: Date;
  companyId?: ObjectId;
  appId?: ObjectId;
  updatedAt: Date;
}

// Workload configuration for shift limits
export interface WorkloadConfig {
  maxConcurrentAssignments: number;
  maxDailyAssignments: number;
  priorityWeights: {
    chat: number;
    lead: number;
    ticket: number;
  };
  overrideOnUrgent: boolean;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

// Generic Query Types
export interface ShiftQuery extends PaginationQuery {
  status?: ActiveStatus;
  name?: string;
  teamId?: string;
  scheduleType?: 'fixed' | 'rotating' | 'on_demand';
}

export interface UserAvailabilityQuery extends PaginationQuery {
  userId?: string;
  currentStatus?: 'available' | 'busy' | 'away' | 'offline';
  hasCurrentShift?: boolean;
}

// Response Types
export interface ShiftResponse extends Omit<Shift, '_id'> {
  id: string;
}

export interface UserAvailabilityResponse extends Omit<UserAvailability, '_id'> {
  id: string;
}

// List Response Types
export interface ShiftListResponse extends ListResponse<ShiftResponse> {}
export interface UserAvailabilityListResponse extends ListResponse<UserAvailabilityResponse> {}

// Query Options Types
export interface ShiftQueryOptions extends GenericQueryOptions<ShiftQuery> {}
export interface UserAvailabilityQueryOptions extends GenericQueryOptions<UserAvailabilityQuery> {}

// ============================================================================
// SPECIFIC REQUEST TYPES
// ============================================================================

// Shift Requests
export interface CreateShiftRequest {
  name: string;
  description?: string;
  teamId?: string;
  schedule: ShiftSchedule;
  assignmentConfig: DistributionConfig;
  userAvailability?: UserAvailability[];
  workloadConfig?: WorkloadConfig;
}

export interface UpdateShiftRequest {
  name?: string;
  description?: string;
  teamId?: string;
  schedule?: ShiftSchedule;
  assignmentConfig?: DistributionConfig;
  userAvailability?: UserAvailability[];
  workloadConfig?: WorkloadConfig;
  status?: ActiveStatus;
}

// Shift Assignment Requests
export interface CreateShiftAssignmentRequest {
  userId: string;
  role: 'primary' | 'backup';
  priority?: number;
  customSchedule?: {
    startDate: Date;
    endDate?: Date;
    weekdays?: number[];
    startTime?: string;
    endTime?: string;
  };
}

export interface UpdateShiftAssignmentRequest {
  role?: 'primary' | 'backup';
  priority?: number;
  customSchedule?: {
    startDate: Date;
    endDate?: Date;
    weekdays?: number[];
    startTime?: string;
    endTime?: string;
  };
  status?: 'active' | 'inactive' | 'vacation' | 'sick_leave';
}

// User Availability Requests
export interface UpdateUserAvailabilityRequest {
  currentStatus: 'available' | 'busy' | 'away' | 'offline';
  currentWorkload?: {
    activeChats: number;
    activeLeads: number;
    activeTickets: number;
    totalScore: number;
  };
}

// Bulk Operations
export interface BulkAssignUsersToShiftRequest {
  shiftId: string;
  userAssignments: Array<{
    userId: string;
    role: 'primary' | 'backup';
    priority?: number;
  }>;
}
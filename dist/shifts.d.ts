import { ObjectId } from 'mongodb';
import { PaginationQuery, ListResponse, GenericQueryOptions, ActiveStatus } from './common';
import type { DistributionConfig } from './distribution';
export interface Shift {
    name: string;
    description?: string;
    teamId?: ObjectId;
    schedule: ShiftSchedule;
    assignments: ShiftAssignment[];
    assignmentConfig: DistributionConfig;
    userAvailability: UserAvailability[];
    workloadConfig?: WorkloadConfig;
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
    weekdays: number[];
    startTime: string;
    endTime: string;
    timezone: string;
    overlapMinutes?: number;
    transitionStrategy?: 'immediate' | 'finish_current' | 'overlap';
}
export interface ShiftAssignment {
    userId: ObjectId;
    role: 'primary' | 'backup';
    priority: number;
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
        totalScore: number;
    };
    lastActivity: Date;
    lastAssignment: Date;
    companyId?: ObjectId;
    appId?: ObjectId;
    updatedAt: Date;
}
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
export interface ShiftResponse extends Omit<Shift, '_id'> {
    id: string;
}
export interface UserAvailabilityResponse extends Omit<UserAvailability, '_id'> {
    id: string;
}
export interface ShiftListResponse extends ListResponse<ShiftResponse> {
}
export interface UserAvailabilityListResponse extends ListResponse<UserAvailabilityResponse> {
}
export interface ShiftQueryOptions extends GenericQueryOptions<ShiftQuery> {
}
export interface UserAvailabilityQueryOptions extends GenericQueryOptions<UserAvailabilityQuery> {
}
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
export interface UpdateUserAvailabilityRequest {
    currentStatus: 'available' | 'busy' | 'away' | 'offline';
    currentWorkload?: {
        activeChats: number;
        activeLeads: number;
        activeTickets: number;
        totalScore: number;
    };
}
export interface BulkAssignUsersToShiftRequest {
    shiftId: string;
    userAssignments: Array<{
        userId: string;
        role: 'primary' | 'backup';
        priority?: number;
    }>;
}

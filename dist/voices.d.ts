import { ObjectId } from 'mongodb';
import type { ActorType } from './common';
export type VoiceStatus = 'active' | 'inactive' | 'processing' | 'failed';
export interface Voice {
    _id?: ObjectId;
    appId: ObjectId;
    companyId: ObjectId;
    name: string;
    description?: string;
    providerId: string;
    providerVoiceId?: string;
    providerData?: Record<string, unknown>;
    audioSampleUrl?: string;
    status: VoiceStatus;
    createdBy?: string;
    /**
     * De que coleção é o id em `createdBy`. Ver `CreatorStamp` em `common.ts`.
     * Ausente = registro anterior a 2026-08-30 (a informação não existia).
     */
    createdByType?: ActorType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface VoiceResponse {
    id: string;
    appId: string;
    companyId: string;
    name: string;
    description?: string;
    providerId: string;
    providerVoiceId?: string;
    providerData?: Record<string, unknown>;
    audioSampleUrl?: string;
    status: VoiceStatus;
    createdBy?: string;
    /**
     * De que coleção é o id em `createdBy`. Ver `CreatorStamp` em `common.ts`.
     * Ausente = registro anterior a 2026-08-30 (a informação não existia).
     */
    createdByType?: ActorType;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface CreateVoiceRequest {
    name: string;
    description?: string;
    providerId?: string;
    removeBackgroundNoise?: boolean;
}
export interface UpdateVoiceRequest {
    name?: string;
    description?: string;
    status?: VoiceStatus;
}
export interface VoiceQuery {
    search?: string;
    status?: VoiceStatus;
    providerId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface VoiceDropdownItem {
    id: string;
    name: string;
    providerId: string;
    status: VoiceStatus;
}

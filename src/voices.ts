import { ObjectId } from 'mongodb';
import type { ActorType } from './common';

// ============================================================================
// VOICE STATUS
// ============================================================================

export type VoiceStatus = 'active' | 'inactive' | 'processing' | 'failed';

// ============================================================================
// VOICE ENTITY (Database schema)
// ============================================================================

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

// ============================================================================
// VOICE RESPONSE (API response)
// ============================================================================

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

// ============================================================================
// VOICE REQUESTS
// ============================================================================

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

// ============================================================================
// VOICE QUERY
// ============================================================================

export interface VoiceQuery {
  search?: string;
  status?: VoiceStatus;
  providerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// VOICE DROPDOWN ITEM
// ============================================================================

export interface VoiceDropdownItem {
  id: string;
  name: string;
  providerId: string;
  status: VoiceStatus;
}

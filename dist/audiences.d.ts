import type { ObjectId } from 'mongodb';
import type { ActorType } from './common';
export type AudienceIdentifierType = 'phone' | 'email';
export type AudienceProcessingStatus = 'idle' | 'processing' | 'failed';
export type AudienceEntrySource = 'import' | 'manual';
export interface AudienceImportReport {
    jobId: string;
    startedAt: Date;
    finishedAt?: Date;
    totalLines: number;
    imported: number;
    duplicatesIgnored: number;
    invalidRejected: number;
    errorMessage?: string;
}
export interface AudienceImportReportResponse {
    jobId: string;
    startedAt: string;
    finishedAt?: string;
    totalLines: number;
    imported: number;
    duplicatesIgnored: number;
    invalidRejected: number;
    errorMessage?: string;
}
export interface Audience {
    _id?: ObjectId;
    appId: ObjectId;
    companyId: ObjectId;
    name: string;
    description?: string;
    identifierType: AudienceIdentifierType;
    totalEntries: number;
    processingStatus: AudienceProcessingStatus;
    lastImport?: AudienceImportReport;
    createdBy: ObjectId;
    /**
     * De que coleção é o id em `createdBy`. Ver `CreatorStamp` em `common.ts`.
     * Ausente = registro anterior a 2026-08-30 (a informação não existia).
     */
    createdByType?: ActorType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface AudienceResponse {
    id: string;
    name: string;
    description?: string;
    identifierType: AudienceIdentifierType;
    totalEntries: number;
    processingStatus: AudienceProcessingStatus;
    lastImport?: AudienceImportReportResponse;
    createdBy: string;
    /**
     * De que coleção é o id em `createdBy`. Ver `CreatorStamp` em `common.ts`.
     * Ausente = registro anterior a 2026-08-30 (a informação não existia).
     */
    createdByType?: ActorType;
    createdAt: string;
    updatedAt: string;
}
export interface AudienceEntry {
    _id?: ObjectId;
    appId: ObjectId;
    companyId: ObjectId;
    audienceId: ObjectId;
    identifier: string;
    name?: string;
    source: AudienceEntrySource;
    importJobId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AudienceEntryResponse {
    id: string;
    audienceId: string;
    identifier: string;
    name?: string;
    source: AudienceEntrySource;
    importJobId?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateAudienceRequest {
    name: string;
    description?: string;
    identifierType: AudienceIdentifierType;
}
export interface UpdateAudienceRequest {
    name?: string;
    description?: string;
}
export interface CreateAudienceEntryRequest {
    identifier: string;
    name?: string;
}
export interface UpdateAudienceEntryRequest {
    name?: string;
}
export interface AudienceQuery {
    page?: number;
    limit?: number;
    search?: string;
    identifierType?: AudienceIdentifierType;
}
export interface AudienceEntryQuery {
    page?: number;
    limit?: number;
    search?: string;
}
export interface AudienceImportPreviewResponse {
    headers: string[];
    rows: string[][];
}
export interface AudienceImportRequest {
    identifierColumn: string;
    nameColumn?: string;
}
export interface AudienceImportResponse {
    jobId: string;
}
export interface AudienceDropdownItem {
    id: string;
    name: string;
    identifierType: AudienceIdentifierType;
    totalEntries: number;
}

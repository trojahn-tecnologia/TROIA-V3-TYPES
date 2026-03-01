import { ObjectId } from 'mongodb';
import { PaginationQuery, ListResponse } from './common';
export interface DnsRecord {
    record: 'SPF' | 'DKIM' | 'DMARC' | 'MX';
    type: 'MX' | 'TXT' | 'CNAME';
    name: string;
    value: string;
    priority?: number;
    ttl: string;
    status: 'not_started' | 'pending' | 'verified' | 'failed';
}
export interface EmailDomain {
    _id?: ObjectId;
    domain: string;
    providerId: string;
    providerDomainId?: string;
    region?: string;
    dnsRecords: DnsRecord[];
    status: 'not_started' | 'pending' | 'verified' | 'partially_verified' | 'failed';
    sendingVerified: boolean;
    receivingVerified: boolean;
    verifiedAt?: Date;
    lastVerificationAt?: Date;
    sendingEnabled: boolean;
    receivingEnabled: boolean;
    openTracking: boolean;
    clickTracking: boolean;
    tls: 'opportunistic' | 'enforced';
    returnPath?: string;
    companyId: ObjectId;
    appId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface EmailDomainResponse {
    id: string;
    domain: string;
    providerId: string;
    providerDomainId?: string;
    region?: string;
    dnsRecords: DnsRecord[];
    status: 'not_started' | 'pending' | 'verified' | 'partially_verified' | 'failed';
    sendingVerified: boolean;
    receivingVerified: boolean;
    verifiedAt?: string;
    lastVerificationAt?: string;
    sendingEnabled: boolean;
    receivingEnabled: boolean;
    openTracking: boolean;
    clickTracking: boolean;
    tls: 'opportunistic' | 'enforced';
    returnPath?: string;
    appId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}
export interface EmailDomainDropdownItem {
    id: string;
    domain: string;
    status: string;
}
export interface EmailDomainListResponse extends ListResponse<EmailDomainResponse> {
}
export interface CreateEmailDomainRequest {
    domain: string;
    sendingEnabled?: boolean;
    receivingEnabled?: boolean;
    region?: string;
}
export interface UpdateEmailDomainRequest {
    openTracking?: boolean;
    clickTracking?: boolean;
    tls?: 'opportunistic' | 'enforced';
    sendingEnabled?: boolean;
    receivingEnabled?: boolean;
}
export interface EmailDomainQuery extends PaginationQuery {
    status?: string;
    domain?: string;
}

export interface ContactAddress {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}
export interface PersonalInfo {
    birthDate?: string;
    address?: ContactAddress;
}
export interface ContactIdentifiers {
    email: string[];
    phone: string[];
    whatsapp: string[];
    instagram: string[];
    facebook: string[];
    telegram: string[];
}
/**
 * Carrega o carimbo de autoria (`createdBy` + `createdByType`) desde
 * 2026-08-30. Os dois são opcionais: registro anterior a essa data não tem a
 * informação, e ausente é a verdade. Ver `CreatorStamp` em `common.ts`.
 */
export interface Contact extends CreatorStamp {
    id: string;
    appId: string;
    companyId: string;
    name: string;
    picture?: string;
    tags: string[];
    identifiers: ContactIdentifiers;
    customerId?: string;
    personalInfo?: PersonalInfo;
    assigneeId?: string;
    teamId?: string;
    lastInteractionAt?: string;
    mutedBy?: string[];
    emailTicketAuthorization?: 'approved' | 'blocked';
    blocked?: boolean;
    blockedAt?: string;
    blockedBy?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateContactRequest {
    name: string;
    picture?: string;
    tags?: string[];
    identifiers: Partial<ContactIdentifiers>;
    personalInfo?: PersonalInfo;
    customerId?: string;
    assigneeId?: string;
    teamId?: string;
}
export interface UpdateContactRequest {
    name?: string;
    picture?: string;
    tags?: string[];
    identifiers?: Partial<ContactIdentifiers>;
    personalInfo?: PersonalInfo;
    customerId?: string;
    assigneeId?: string;
    teamId?: string;
}
export type ContactResponse = Contact;
export interface ContactQuery extends PaginationQuery {
    filters?: {
        name?: string;
        email?: string;
        phone?: string;
        whatsappLid?: string;
        instagramId?: string;
        facebookId?: string;
        telegramId?: string;
        customerId?: string;
        tags?: string[];
        assigneeId?: string;
        teamId?: string;
        blocked?: boolean;
    };
}
export interface ContactListResponse extends ListResponse<ContactResponse> {
}
import { CreatorStamp, ListResponse, PaginationQuery } from './common';

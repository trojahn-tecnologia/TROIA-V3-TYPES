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
export interface Contact {
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
    };
}
export interface ContactListResponse extends ListResponse<ContactResponse> {
}
import { PaginationQuery, ListResponse } from './common';

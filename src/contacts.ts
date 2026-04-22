// Personal Info Types
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

// Contact Types - Multi-channel identifier support
export interface ContactIdentifiers {
  // Generic identifiers (fallback for all providers)
  email: string[];
  phone: string[];

  // Provider-specific identifiers (arrays of strings)
  // WhatsApp: ["5547991236370@s.whatsapp.net", "213782781983172@lid", "+5547991236370"]
  whatsapp: string[];

  // Instagram: ["username", "17841401234567890"]
  instagram: string[];

  // Facebook: ["username", "fb_id_123456"]
  facebook: string[];

  // Telegram: ["@username", "123456789"]
  telegram: string[];
}

export interface Contact {
  id: string;
  appId: string;
  companyId: string;

  // Basic identification
  name: string;
  picture?: string;
  tags: string[];

  // Multi-channel identifiers
  identifiers: ContactIdentifiers;

  // Relationships
  customerId?: string;

  // Personal information
  personalInfo?: PersonalInfo;

  // Assignment system integration
  assigneeId?: string;
  teamId?: string;

  // Interaction tracking
  lastInteractionAt?: string;  // Updated when client SENDS a message

  // Mute preference per-user — lista de userIds que silenciaram notificações
  // deste contato. Persiste entre lifecycles de conversation (quando conv fecha
  // e novo atendimento é aberto, o mute segue o contato, não a conv).
  // Toggle via POST /conversations/:id/mute|unmute (backend roteia pro Contact
  // quando conv é individual).
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

export interface ContactListResponse extends ListResponse<ContactResponse> {}

// Import types
import { PaginationQuery, ListResponse } from './common';
// Conversation Types - Sistema multi-canal de conversas

export interface ConversationPrivacy {
  enabled: boolean;
  users: string[]; // ObjectId as string in response
}

export interface Conversation {
  id: string;
  appId: string;
  companyId: string;

  // Core conversation data
  subject?: string;
  status: 'waiting' | 'active' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  closeReason?: 'resolved' | 'spam' | 'duplicate' | 'no_response' | 'transferred' | 'expired' | 'other';
  closeNotes?: string;
  isReturn?: boolean;  // Flag para indicar se é um retorno/reengajamento

  // Multi-channel support
  channelId: string;          // Channel where conversation happens
  conversationType?: 'individual' | 'group';  // ✅ Conversation type classification (structure)

  // External provider integration
  providerConversationId?: string; // External conversation ID
  source: string;                  // Universal source identifier

  // Participants
  customerId?: string;
  userId?: string;      // User associated with conversation (for AI agent context)

  // ✅ Relationship fields (ObjectIds - stored in database)
  contactId?: string;  // Contact relationship (ObjectId)
  groupId?: string;    // Group relationship (ObjectId)

  // ✅ Populated via aggregation (not stored in database)
  contact?: {
    id: string;         // Contact ID
    name: string;       // Contact name
    picture?: string;   // Contact avatar URL
    phone?: string;     // Contact primary phone
    tags?: string[];    // Contact tags (populated for list rendering)
  };

  // ✅ Populated via aggregation (not stored in database)
  group?: {
    id: string;         // Group ID
    name: string;       // Group name
    picture?: string;   // Group avatar URL
  };

  // ✅ Group members (populated via aggregation, only for group conversations)
  members?: Array<{
    id: string;         // Contact ID
    name: string;       // Contact name
    picture?: string;   // Contact avatar URL
    phone?: string;     // Contact primary phone
    role: 'admin' | 'member';  // ✅ Participant role
    joinedAt: string;   // ✅ When participant joined
  }>;

  // ⚠️ Conversation media is NOT embedded on the conversation anymore.
  //    Antes existia um `files?: []` populado via $lookup que agregava TODAS as
  //    mídias num único documento — para conversas com muita mídia isso estourava
  //    o limite de 16MB do MongoDB e quebrava qualquer leitura da conversa
  //    (inclusive o caminho de criação de mensagem). Agora a mídia é servida
  //    paginada via `GET /conversations/:id/media` → `ConversationMediaListResponse`.

  // Lead/Ticket integration
  leadId?: string;            // Associated lead
  ticketId?: string;          // Associated ticket

  // Assignment system integration
  assigneeId?: string;        // User responsible
  assignee?: {                // ✅ Populated assignee data (via aggregation, not stored)
    id: string;
    name: string;
    picture?: string;
  };
  teamId?: string;           // Team responsible
  assignmentType?: string;    // Type of assignment
  assignedAt?: string;
  assignedBy?: string;

  // ✅ AI Agent integration (defines if conversation is AI-powered)
  agentId?: string;           // AI Agent ID (ObjectId) - if present, conversation is AI-powered
  agentStatus?: 'active' | 'inactive' | 'paused'; // AI Agent status in this conversation

  // Provider integration (via lookup)
  provider?: {                // ✅ Populated provider data (via lookup, not stored)
    id: string;
    name: string;
    type: string;
    logo?: string;
  };

  // Conversation metrics
  messageCount: number;
  lastMessage?: string;        // ✅ Preview of last message (100 chars max)
  lastMessageAt?: string;
  lastMessageFromCustomer?: string;
  lastMessageFromAgent?: string;

  // Response time tracking
  firstResponseTime?: number;  // Minutes to first response
  averageResponseTime?: number; // Average response time

  // Tags and categories
  tags: string[];
  category?: string;

  // Privacy settings
  privacy?: ConversationPrivacy;

  // Preferência de silenciamento per-usuário.
  // ✅ Computed: `true` quando o userId do request silenciou o alvo.
  //    O mute é armazenado em `Contact.mutedBy` (conv individual) ou
  //    `Group.mutedBy` (conv grupo) — NUNCA no próprio Conversation.
  //    Isso garante que o mute de individual persiste quando a conv fecha
  //    e uma nova é criada pro mesmo contato.
  //    Populado via `mapToResponse(doc, userId)` no backend.
  // ⚠️ A lista bruta de userIds nunca é exposta — frontend usa só `muted`.
  //    Toggle via POST /conversations/:id/mute e /unmute (backend roteia).
  muted?: boolean;

  // Channel-based permissions
  userRole?: 'viewer' | 'attendant'; // role do usuário logado no canal da conversa

  // Metadata
  metadata?: Record<string, unknown>; // Channel-specific metadata

  // ✅ Unread tracking per user (Arch 3.4)
  unreadTracking?: {
    [userId: string]: {
      count: number;
      lastResetAt: string;
      autoResetOnOpen: boolean;
    }
  };

  // Dates
  startedAt: string;
  endedAt?: string;
  closedAt?: string;    // Timestamp when conversation was closed
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationRequest {
  subject?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  status?: 'waiting' | 'active' | 'closed';
  channelId: string;
  conversationType?: 'individual' | 'group';  // ✅ Conversation type classification (structure)
  providerConversationId?: string;
  source: string;
  customerId?: string;

  // ✅ Relationship fields (ObjectIds)
  contactId?: string;  // Contact ID (ObjectId)
  groupId?: string;    // Group ID (ObjectId)

  leadId?: string;
  ticketId?: string;
  assigneeId?: string;
  teamId?: string;

  // ✅ AI Agent integration
  agentId?: string;           // AI Agent ID (ObjectId)
  agentStatus?: 'active' | 'inactive' | 'paused'; // AI Agent status

  tags?: string[];
  category?: string;
  privacy?: ConversationPrivacy;
  metadata?: Record<string, unknown>;
}

export interface UpdateConversationRequest {
  subject?: string;
  status?: 'waiting' | 'active' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  conversationType?: 'individual' | 'group';  // ✅ Conversation type classification (structure)
  closeReason?: 'resolved' | 'spam' | 'duplicate' | 'no_response' | 'transferred' | 'expired' | 'other';
  closeNotes?: string;
  customerId?: string;

  // ✅ Relationship fields (ObjectIds)
  contactId?: string;  // Contact ID (ObjectId)
  groupId?: string;    // Group ID (ObjectId)

  leadId?: string;
  ticketId?: string;
  assigneeId?: string;
  teamId?: string;

  // ✅ AI Agent integration
  agentId?: string;           // AI Agent ID (ObjectId)
  agentStatus?: 'active' | 'inactive' | 'paused'; // AI Agent status

  tags?: string[];
  category?: string;
  privacy?: ConversationPrivacy;
  metadata?: Record<string, unknown>;
}

export type ConversationResponse = Conversation;

export interface ConversationQuery extends PaginationQuery {
  filters?: {
    search?: string;    // ✅ Search filter (also accepted at root level)
    subject?: string;
    status?: 'waiting' | 'active' | 'closed' | Array<'waiting' | 'active' | 'closed'>;  // ✅ Aceita string ou array
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    channelId?: string | string[];
    channelIds?: string[];  // ✅ Internal: channel-based access filter (set by controller, not user-facing)
    _accessFilter?: Record<string, unknown>;  // ✅ Internal: full channel+scope+privacy filter from buildConversationAccessFilter
    channelType?: 'whatsapp' | 'instagram' | 'email' | 'chat' | 'sms' | 'telegram' | 'facebook' | 'widget';
    conversationType?: 'individual' | 'group' | 'ai';  // ✅ Virtual filter: 'ai' = agentId EXISTS AND agentStatus='active'
    providerId?: string;  // ✅ Filter by provider (via channel → integration → provider)
    source?: string;
    excludeSource?: string;
    customerId?: string;
    contactId?: string;  // ✅ Filter by contactId (ObjectId)
    leadId?: string;
    ticketId?: string;
    groupId?: string;    // ✅ Filter by groupId (ObjectId)
    assigneeId?: string | string[];
    teamId?: string;
    category?: string;
    tags?: string[];
    conversationTags?: string[];
    excludeConversationTags?: string[];
    hasUnreadMessages?: boolean;
    createdFrom?: string;
    createdTo?: string;
    lastMessageFrom?: string;
    lastMessageTo?: string;
  };
}

export interface ConversationListResponse extends ListResponse<ConversationResponse> {}

// ============================================================================
// Conversation media (galeria de mídia paginada)
// Servida por GET /conversations/:id/media — substitui o antigo `Conversation.files`
// que era agregado inteiro num único documento (estourava o limite de 16MB do
// MongoDB em conversas com muita mídia).
// ============================================================================

export type ConversationMediaType = 'image' | 'video' | 'audio' | 'document';

export interface ConversationMediaItem {
  messageId: string;            // ID da ConversationMessage de origem
  type: ConversationMediaType;  // Tipo da mídia
  url: string;                  // URL do arquivo
  caption?: string;             // Legenda opcional
  filename?: string;            // Nome original do arquivo
  thumbnailUrl?: string;        // Thumbnail (vídeos/documentos)
  size?: number;                // Tamanho em bytes
  mimeType?: string;            // MIME type
  sentAt: string;               // ISO — quando a mídia foi enviada
}

export interface ConversationMediaCounts {
  total: number;     // Soma de todas as mídias (independente do filtro de tipo)
  image: number;
  video: number;
  audio: number;
  document: number;
}

export interface ConversationMediaQuery extends PaginationQuery {
  type?: ConversationMediaType;  // Filtra por tipo de mídia (opcional)
}

export interface ConversationMediaListResponse {
  items: ConversationMediaItem[];
  total: number;                 // Total que casa com o filtro `type` (== counts.total quando sem filtro)
  page: number;
  limit: number;
  counts: ConversationMediaCounts;
}

// Conversation assignment
export interface AssignConversationRequest {
  assigneeId?: string;
  teamId?: string;
  assignmentType?: string;
}

// Conversation transfer
export interface TransferConversationRequest {
  fromAssigneeId?: string;
  toAssigneeId?: string;
  fromTeamId?: string;
  toTeamId?: string;
  reason?: string;
  notes?: string;
}

// Close conversation
export interface CloseConversationRequest {
  reason?: string;
  notes?: string;
  rating?: number; // Customer satisfaction rating
}

// Conversation statistics
export interface ConversationStats {
  total: number;
  byStatus: Record<string, number>;
  byChannel: Record<string, number>;
  byPriority: Record<string, number>;
  averageResponseTime: number;
  totalUnread: number;
}

// Bulk operations
export interface BulkConversationOperationRequest {
  conversationIds: string[];
  operation: 'assign' | 'transfer' | 'close' | 'addTag' | 'removeTag' | 'changeStatus' | 'changePriority';
  data?: {
    assigneeId?: string;
    teamId?: string;
    status?: 'waiting' | 'active' | 'closed';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    tag?: string;
    reason?: string;
    notes?: string;
  };
}

// Import types
import { PaginationQuery, ListResponse } from './common';

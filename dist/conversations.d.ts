export interface ConversationPrivacy {
    enabled: boolean;
    users: string[];
}
export interface Conversation {
    id: string;
    appId: string;
    companyId: string;
    subject?: string;
    status: 'waiting' | 'active' | 'closed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    closeReason?: 'resolved' | 'spam' | 'duplicate' | 'no_response' | 'transferred' | 'expired' | 'other';
    closeNotes?: string;
    isReturn?: boolean;
    channelId: string;
    conversationType?: 'individual' | 'group';
    providerConversationId?: string;
    source: string;
    customerId?: string;
    userId?: string;
    contactId?: string;
    groupId?: string;
    contact?: {
        id: string;
        name: string;
        picture?: string;
        phone?: string;
    };
    group?: {
        id: string;
        name: string;
        picture?: string;
    };
    members?: Array<{
        id: string;
        name: string;
        picture?: string;
        phone?: string;
        role: 'admin' | 'member';
        joinedAt: string;
    }>;
    files?: Array<{
        type: 'image' | 'video' | 'audio' | 'document';
        url: string;
        caption?: string;
        filename?: string;
        thumbnailUrl?: string;
        size?: number;
        mimeType?: string;
        sentAt: string;
    }>;
    leadId?: string;
    ticketId?: string;
    assigneeId?: string;
    assignee?: {
        id: string;
        name: string;
        picture?: string;
    };
    teamId?: string;
    assignmentType?: string;
    assignedAt?: string;
    assignedBy?: string;
    agentId?: string;
    agentStatus?: 'active' | 'inactive' | 'paused';
    provider?: {
        id: string;
        name: string;
        type: string;
        logo?: string;
    };
    messageCount: number;
    lastMessage?: string;
    lastMessageAt?: string;
    lastMessageFromCustomer?: string;
    lastMessageFromAgent?: string;
    firstResponseTime?: number;
    averageResponseTime?: number;
    tags: string[];
    category?: string;
    privacy?: ConversationPrivacy;
    userRole?: 'viewer' | 'attendant';
    metadata?: Record<string, any>;
    unreadTracking?: {
        [userId: string]: {
            count: number;
            lastResetAt: string;
            autoResetOnOpen: boolean;
        };
    };
    startedAt: string;
    endedAt?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateConversationRequest {
    subject?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    status?: 'waiting' | 'active' | 'closed';
    channelId: string;
    conversationType?: 'individual' | 'group';
    providerConversationId?: string;
    source: string;
    customerId?: string;
    contactId?: string;
    groupId?: string;
    leadId?: string;
    ticketId?: string;
    assigneeId?: string;
    teamId?: string;
    agentId?: string;
    agentStatus?: 'active' | 'inactive' | 'paused';
    tags?: string[];
    category?: string;
    privacy?: ConversationPrivacy;
    metadata?: Record<string, any>;
}
export interface UpdateConversationRequest {
    subject?: string;
    status?: 'waiting' | 'active' | 'closed';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    conversationType?: 'individual' | 'group';
    closeReason?: 'resolved' | 'spam' | 'duplicate' | 'no_response' | 'transferred' | 'expired' | 'other';
    closeNotes?: string;
    customerId?: string;
    contactId?: string;
    groupId?: string;
    leadId?: string;
    ticketId?: string;
    assigneeId?: string;
    teamId?: string;
    agentId?: string;
    agentStatus?: 'active' | 'inactive' | 'paused';
    tags?: string[];
    category?: string;
    privacy?: ConversationPrivacy;
    metadata?: Record<string, any>;
}
export type ConversationResponse = Conversation;
export interface ConversationQuery extends PaginationQuery {
    filters?: {
        search?: string;
        subject?: string;
        status?: 'waiting' | 'active' | 'closed' | Array<'waiting' | 'active' | 'closed'>;
        priority?: 'low' | 'normal' | 'high' | 'urgent';
        channelId?: string | string[];
        channelIds?: string[];
        _accessFilter?: Record<string, unknown>;
        channelType?: 'whatsapp' | 'instagram' | 'email' | 'chat' | 'sms' | 'telegram' | 'facebook' | 'widget';
        conversationType?: 'individual' | 'group' | 'ai';
        providerId?: string;
        source?: string;
        excludeSource?: string;
        customerId?: string;
        contactId?: string;
        leadId?: string;
        ticketId?: string;
        groupId?: string;
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
export interface ConversationListResponse extends ListResponse<ConversationResponse> {
}
export interface AssignConversationRequest {
    assigneeId?: string;
    teamId?: string;
    assignmentType?: string;
}
export interface TransferConversationRequest {
    fromAssigneeId?: string;
    toAssigneeId?: string;
    fromTeamId?: string;
    toTeamId?: string;
    reason?: string;
    notes?: string;
}
export interface CloseConversationRequest {
    reason?: string;
    notes?: string;
    rating?: number;
}
export interface ConversationStats {
    total: number;
    byStatus: Record<string, number>;
    byChannel: Record<string, number>;
    byPriority: Record<string, number>;
    averageResponseTime: number;
    totalUnread: number;
}
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
import { PaginationQuery, ListResponse } from './common';

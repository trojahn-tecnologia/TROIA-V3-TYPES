import { PaginationQuery, ListResponse } from './common';
export interface Group {
    id: string;
    appId: string;
    companyId: string;
    name: string;
    avatar?: string;
    description?: string;
    providerGroupId?: string;
    channelId: string;
    createdBy: string;
    participantsCount: number;
    messagesCount: number;
    settings?: {
        onlyAdminsCanSend?: boolean;
        onlyAdminsCanEdit?: boolean;
        allowMemberAdd?: boolean;
    };
    mutedBy?: string[];
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface CreateGroupRequest {
    name: string;
    avatar?: string;
    description?: string;
    channelId: string;
    providerGroupId?: string;
    participants: Array<{
        participantType: 'customer' | 'contact' | 'user';
        participantId: string;
        role?: 'admin' | 'member';
    }>;
    settings?: {
        onlyAdminsCanSend?: boolean;
        onlyAdminsCanEdit?: boolean;
        allowMemberAdd?: boolean;
    };
}
export interface UpdateGroupRequest {
    name?: string;
    avatar?: string;
    description?: string;
    settings?: {
        onlyAdminsCanSend?: boolean;
        onlyAdminsCanEdit?: boolean;
        allowMemberAdd?: boolean;
    };
}
export type GroupResponse = Group;
export interface GroupQuery extends PaginationQuery {
    filters?: {
        name?: string;
        channelId?: string;
        createdBy?: string;
        participantId?: string;
    };
}
export interface GroupListResponse extends ListResponse<GroupResponse> {
}
export interface AddParticipantsRequest {
    participants: Array<{
        participantType: 'customer' | 'contact' | 'user';
        participantId: string;
        role?: 'admin' | 'member';
    }>;
}
export interface RemoveParticipantRequest {
    participantId: string;
    reason?: string;
}
export interface UpdateParticipantRoleRequest {
    role: 'admin' | 'member';
}

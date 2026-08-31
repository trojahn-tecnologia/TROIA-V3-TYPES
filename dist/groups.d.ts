import { ActorType, PaginationQuery, ListResponse } from './common';
export interface Group {
    id: string;
    appId: string;
    companyId: string;
    name: string;
    avatar?: string;
    description?: string;
    providerGroupId?: string;
    channelId: string;
    /**
     * Quem criou o grupo. OPCIONAL desde 2026-08-30.
     *
     * Era obrigatório e valia `'system'` para TODO grupo: o `preprocessCreate`
     * do repository montava um objeto novo e cravava a palavra, descartando o id
     * que o service passava. As três checagens "admin OU o criador" comparavam
     * um id com a palavra `'system'` e nunca abriam pelo lado do criador.
     *
     * Grupo anterior a essa data não tem a informação — e ausente é a verdade.
     * Ver `CreatorStamp` em `common.ts`.
     */
    createdBy?: string;
    createdByType?: ActorType;
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

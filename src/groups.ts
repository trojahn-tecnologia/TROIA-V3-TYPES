// Group Types - Sistema de grupos multi-canal
import { PaginationQuery, ListResponse } from './common';

export interface Group {
  id: string;
  appId: string;
  companyId: string;

  // Group data
  name: string;
  avatar?: string;
  description?: string;

  // Provider integration
  providerGroupId?: string;    // External group ID (WhatsApp, etc)
  channelId: string;           // Channel onde grupo existe

  // Metadata
  createdBy: string;           // User que criou
  participantsCount: number;   // Cache do número de participantes
  messagesCount: number;       // Cache do número de mensagens

  // Settings
  settings?: {
    onlyAdminsCanSend?: boolean;
    onlyAdminsCanEdit?: boolean;
    allowMemberAdd?: boolean;
  };

  // Mute preference per-user — lista de userIds que silenciaram notificações
  // deste grupo. Toggle via POST /conversations/:id/mute|unmute (backend roteia
  // pro Group quando conv é de grupo).
  mutedBy?: string[];

  // Dates
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
    participantId?: string;  // Grupos onde participante está
  };
}

export interface GroupListResponse extends ListResponse<GroupResponse> {}

// Group participant operations
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

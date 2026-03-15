export type TicketFollowerType = 'user' | 'contact';
export type TicketFollowerSource = 'manual' | 'email_cc' | 'system';

export interface TicketFollower {
  _id?: string;
  appId: string;
  companyId: string;
  ticketId: string;
  followerType: TicketFollowerType;
  followerId: string;
  source: TicketFollowerSource;
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface TicketFollowerResponse extends Omit<TicketFollower, '_id'> {
  id: string;
  // Populated via Two-Phase Fetch
  followerName?: string;
  followerEmail?: string;
  followerPicture?: string;
}

export interface AddTicketFollowerRequest {
  ticketId: string;
  followerType: TicketFollowerType;
  followerId: string;
  source?: TicketFollowerSource;
}

export interface BulkAddTicketFollowersRequest {
  ticketId: string;
  followers: Array<{
    followerType: TicketFollowerType;
    followerId: string;
    source?: TicketFollowerSource;
  }>;
}

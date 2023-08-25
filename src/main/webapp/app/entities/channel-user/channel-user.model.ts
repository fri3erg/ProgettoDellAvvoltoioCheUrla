import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';

export interface IChannelUser {
  id: string;
  userId?: string | null;
  channelId?: string | null;
  privilege?: keyof typeof PrivilegeType | null;
}

export type NewChannelUser = Omit<IChannelUser, 'id'> & { id: null };

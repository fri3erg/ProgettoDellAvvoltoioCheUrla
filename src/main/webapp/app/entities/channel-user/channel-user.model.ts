import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';

export interface IChannelUser {
  id: string;
  user_id?: string | null;
  channel_id?: string | null;
  privilege?: keyof typeof PrivilegeType | null;
}

export type NewChannelUser = Omit<IChannelUser, 'id'> & { id: null };

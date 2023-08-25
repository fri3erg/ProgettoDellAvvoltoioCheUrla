import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';

export interface IChannel {
  id: string;
  name?: string | null;
  type?: keyof typeof ChannelTypes | null;
  modType?: string | null;
  emergency?: boolean | null;
}

export type NewChannel = Omit<IChannel, 'id'> & { id: null };

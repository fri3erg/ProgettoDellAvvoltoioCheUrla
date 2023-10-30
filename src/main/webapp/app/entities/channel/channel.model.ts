import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';

export interface IChannel {
  _id?: string;
  name?: string | null;
  type?: keyof typeof ChannelTypes | null;
  mod_type?: string | null;
  emergency?: boolean | null;
}

export type NewChannel = Omit<IChannel, '_id'> & { _id: null };

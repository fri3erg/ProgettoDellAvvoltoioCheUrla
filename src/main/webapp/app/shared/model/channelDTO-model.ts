import { IChannelUser } from 'app/entities/channel-user/channel-user.model';
import { IChannel } from 'app/entities/channel/channel.model';

export interface IChannelDTO {
  channel: IChannel;
  users: IChannelUser[];
}

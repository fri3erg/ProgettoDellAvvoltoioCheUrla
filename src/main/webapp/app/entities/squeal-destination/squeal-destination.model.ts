import { ISqueal } from 'app/entities/squeal/squeal.model';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';

export interface ISquealDestination {
  destination?: string | null;
  destinationId?: string | null;
  seen?: boolean | null;
  destinationType?: keyof typeof ChannelTypes | null;
  adminAdd?: boolean | null;
  squeal?: Pick<ISqueal, 'id'> | null;
}

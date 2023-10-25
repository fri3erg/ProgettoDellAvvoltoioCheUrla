import { ISqueal } from 'app/entities/squeal/squeal.model';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';

export interface ISquealDestination {
  destination?: string | null;
  destinationId?: string | null;
  seen?: boolean | null;
  destination_type?: keyof typeof ChannelTypes | null;
  admin_add?: boolean | null;
  squeal?: Pick<ISqueal, 'id'> | null;
}

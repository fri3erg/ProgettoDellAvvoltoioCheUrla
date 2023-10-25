import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';

import { ISquealDestination } from './squeal-destination.model';

export const sampleWithRequiredData: ISquealDestination = {};

export const sampleWithPartialData: ISquealDestination = {};

export const sampleWithFullData: ISquealDestination = {
  destination: 'Tuna',
  destination_type: 'MESSAGE',
  admin_add: false,
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

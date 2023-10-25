import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';

import { IChannel, NewChannel } from './channel.model';

export const sampleWithRequiredData: IChannel = {
  id: 'a26498d7-f472-4da8-a7c6-6990f961e3a6',
};

export const sampleWithPartialData: IChannel = {
  id: '88eceb70-054e-4a4d-8acc-817f5a33ad49',
  name: 'Diesel',
  type: 'PUBLICGROUP',
};

export const sampleWithFullData: IChannel = {
  id: 'c0909d62-3fb8-4ae5-b73c-89a3ec775ace',
  name: 'Molybdenum Loan',
  type: 'PRIVATEGROUP',
  mod_type: 'Nissan',
  emergency: true,
};

export const sampleWithNewData: NewChannel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

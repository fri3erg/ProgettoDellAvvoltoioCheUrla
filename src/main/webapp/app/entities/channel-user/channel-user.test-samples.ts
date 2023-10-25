import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';

import { IChannelUser, NewChannelUser } from './channel-user.model';

export const sampleWithRequiredData: IChannelUser = {
  id: '82c66563-4ec4-42d8-9b26-1629c5abb342',
};

export const sampleWithPartialData: IChannelUser = {
  id: 'be50061b-05c3-4658-8f65-5ce4b49d4a80',
  user_id: 'input',
};

export const sampleWithFullData: IChannelUser = {
  id: 'f6085293-3fcd-41ec-9af8-810f06cd34ed',
  user_id: 'Minivan plum Connecticut',
  channel_id: 'East',
  privilege: 'ADMIN',
};

export const sampleWithNewData: NewChannelUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

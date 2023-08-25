import { ISMMVIP, NewSMMVIP } from './smmvip.model';

export const sampleWithRequiredData: ISMMVIP = {
  id: '4e3d6a3f-f359-42f3-8886-def60b2f9797',
};

export const sampleWithPartialData: ISMMVIP = {
  id: '35d1b670-6997-416e-ba34-77699c6dd62e',
};

export const sampleWithFullData: ISMMVIP = {
  id: 'f3ea2c5e-d3fb-4f02-ab81-9f426c8c9e40',
  userId: 'Cheese',
};

export const sampleWithNewData: NewSMMVIP = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

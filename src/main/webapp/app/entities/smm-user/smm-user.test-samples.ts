import { ISMMUser } from './smm-user.model';

export const sampleWithRequiredData: ISMMUser = {};

export const sampleWithPartialData: ISMMUser = {
  user_id: 'Analyst state',
};

export const sampleWithFullData: ISMMUser = {
  user_id: 'beloved',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

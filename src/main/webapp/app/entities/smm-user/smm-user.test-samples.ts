import { ISMMUser } from './smm-user.model';

export const sampleWithRequiredData: ISMMUser = {};

export const sampleWithPartialData: ISMMUser = {
  userId: 'Analyst state',
};

export const sampleWithFullData: ISMMUser = {
  userId: 'beloved',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

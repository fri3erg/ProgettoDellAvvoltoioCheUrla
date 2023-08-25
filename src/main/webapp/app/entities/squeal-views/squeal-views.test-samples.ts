import { ISquealViews, NewSquealViews } from './squeal-views.model';

export const sampleWithRequiredData: ISquealViews = {
  id: '3a1d94f2-e66b-4cbd-a8a1-b50d11d526cc',
};

export const sampleWithPartialData: ISquealViews = {
  id: '58bd7b94-65d4-498c-ac41-a0e4e133abc4',
  squealId: 'indigo',
};

export const sampleWithFullData: ISquealViews = {
  id: 'ed5e142d-1d94-438a-b314-c3e3eff42b49',
  squealId: 'vastly',
  number: 7645,
};

export const sampleWithNewData: NewSquealViews = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

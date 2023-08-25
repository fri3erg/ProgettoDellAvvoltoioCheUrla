import { ISquealReaction, NewSquealReaction } from './squeal-reaction.model';

export const sampleWithRequiredData: ISquealReaction = {
  id: '454964a8-4a1c-45ab-9e3f-382086b8d4b7',
};

export const sampleWithPartialData: ISquealReaction = {
  id: '65b942c3-736a-4cbe-9992-471773bec0a9',
  userId: 'Health Blues',
  username: 'Modern West',
};

export const sampleWithFullData: ISquealReaction = {
  id: 'e3dc79af-643b-4efb-b51b-9cfea3696d87',
  userId: 'below Pants',
  username: 'newton',
  squealId: 'Fish Concrete',
  positive: true,
  emoji: 'Branding meaningfully',
};

export const sampleWithNewData: NewSquealReaction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

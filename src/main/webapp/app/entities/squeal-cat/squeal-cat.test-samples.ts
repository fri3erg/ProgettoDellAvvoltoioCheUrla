import { CategoryTypes } from 'app/entities/enumerations/category-types.model';

import { ISquealCat, NewSquealCat } from './squeal-cat.model';

export const sampleWithRequiredData: ISquealCat = {
  id: '2348aa96-042e-4c64-bbbc-7aa070ad96e2',
};

export const sampleWithPartialData: ISquealCat = {
  id: '492a69c6-93c9-48e0-a20f-2b227f5affd8',
  userId: 'violently',
  nCharacters: 12122,
};

export const sampleWithFullData: ISquealCat = {
  id: 'f4c9fc3b-f920-434d-a810-e4febcbd225b',
  userId: 'pitiful',
  squealId: 'Persevering monitor',
  category: 'CONTROVERSIAL',
  nCharacters: 16875,
  timestamp: 16733,
};

export const sampleWithNewData: NewSquealCat = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

import { ISqueal, NewSqueal } from './squeal.model';

export const sampleWithRequiredData: ISqueal = {
  id: '64ddc71b-8f47-4ad9-a61b-36934b414d0a',
};

export const sampleWithPartialData: ISqueal = {
  id: '9c51a355-9f12-4fa5-866e-52c1be95c592',
  body: 'Steel',
  videoContentType: 'Switzerland',
  videoName: 'Rhodium Senior background',
  nCharacters: 3488,
  squealIdResponse: 'Account male descriptive',
};

export const sampleWithFullData: ISqueal = {
  id: '5952c162-a1d2-491b-bed8-2e2323008cc7',
  userId: 'Diesel',
  timestamp: 16098,
  body: 'Small lime gold',
  img: '../fake-data/blob/hipster.png',
  imgContentType: 'unknown',
  imgName: 'Small Savings Consultant',
  videoContentType: 'Genderqueer Southwest',
  videoName: 'evergreen oof Georgia',
  nCharacters: 31129,
  squealIdResponse: 'actually Response',
  refreshTime: 8053,
};

export const sampleWithNewData: NewSqueal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

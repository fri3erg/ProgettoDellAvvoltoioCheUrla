import { ISqueal, NewSqueal } from './squeal.model';

export const sampleWithRequiredData: ISqueal = {
  _id: '64ddc71b-8f47-4ad9-a61b-36934b414d0a',
};

export const sampleWithPartialData: ISqueal = {
  _id: '9c51a355-9f12-4fa5-866e-52c1be95c592',
  body: 'Steel',
  video_content_type: 'Switzerland',
  video_name: 'Rhodium Senior background',
  n_characters: 3488,
  squeal_id_response: 'Account male descriptive',
};

export const sampleWithFullData: ISqueal = {
  _id: '5952c162-a1d2-491b-bed8-2e2323008cc7',
  user_id: 'Diesel',
  timestamp: 16098,
  body: 'Small lime gold',
  img: '../fake-data/blob/hipster.png',
  img_content_type: 'unknown',
  img_name: 'Small Savings Consultant',
  video_content_type: 'Genderqueer Southwest',
  video_name: 'evergreen oof Georgia',
  n_characters: 31129,
  squeal_id_response: 'actually Response',
  refresh_time: 8053,
};

export const sampleWithNewData: NewSqueal = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

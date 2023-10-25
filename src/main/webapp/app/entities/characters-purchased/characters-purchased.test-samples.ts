import { ICharactersPurchased, NewCharactersPurchased } from './characters-purchased.model';

export const sampleWithRequiredData: ICharactersPurchased = {
  id: '8fb540d1-0a80-4b0b-b4b4-4413dfeabbde',
};

export const sampleWithPartialData: ICharactersPurchased = {
  id: '509488d7-1c9c-46be-b723-9e5a456a3f56',
  n_characters: 14868,
  timestamp_bought: 18022,
  admin_discount: true,
};

export const sampleWithFullData: ICharactersPurchased = {
  id: 'a47a005f-f8d5-4391-a5e9-6fa2c26982a5',
  user_id: 'state',
  n_characters: 19715,
  timestamp_bought: 5086,
  timestamp_expire: 6871,
  amount: 30009,
  admin_discount: false,
};

export const sampleWithNewData: NewCharactersPurchased = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

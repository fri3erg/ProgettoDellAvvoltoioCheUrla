import { ICharactersPurchased, NewCharactersPurchased } from './characters-purchased.model';

export const sampleWithRequiredData: ICharactersPurchased = {
  id: '8fb540d1-0a80-4b0b-b4b4-4413dfeabbde',
};

export const sampleWithPartialData: ICharactersPurchased = {
  id: '509488d7-1c9c-46be-b723-9e5a456a3f56',
  nCharacters: 14868,
  timestampBought: 18022,
  adminDiscount: true,
};

export const sampleWithFullData: ICharactersPurchased = {
  id: 'a47a005f-f8d5-4391-a5e9-6fa2c26982a5',
  userId: 'state',
  nCharacters: 19715,
  timestampBought: 5086,
  timestampExpire: 6871,
  amount: 30009,
  adminDiscount: false,
};

export const sampleWithNewData: NewCharactersPurchased = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

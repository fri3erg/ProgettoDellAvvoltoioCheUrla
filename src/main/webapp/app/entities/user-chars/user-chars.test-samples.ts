import { IUserChars, NewUserChars } from './user-chars.model';

export const sampleWithRequiredData: IUserChars = {
  id: 'b2effef7-d028-4350-968c-2f310e469ea8',
};

export const sampleWithPartialData: IUserChars = {
  id: 'd29dc24a-b745-490f-a764-599b9481b4a3',
  user_id: 'Lodge internet',
  max_chars: 29696,
  remaning_chars: 12324,
};

export const sampleWithFullData: IUserChars = {
  id: 'c6af4dc8-f4f7-403e-8612-38d6556dd17e',
  user_id: 'West Gasoline',
  max_chars: 21177,
  remaning_chars: 23976,
};

export const sampleWithNewData: NewUserChars = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

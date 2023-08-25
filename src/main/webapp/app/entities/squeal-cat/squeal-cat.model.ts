import { CategoryTypes } from 'app/entities/enumerations/category-types.model';

export interface ISquealCat {
  id: string;
  userId?: string | null;
  squealId?: string | null;
  category?: keyof typeof CategoryTypes | null;
  nCharacters?: number | null;
  timestamp?: number | null;
}

export type NewSquealCat = Omit<ISquealCat, 'id'> & { id: null };

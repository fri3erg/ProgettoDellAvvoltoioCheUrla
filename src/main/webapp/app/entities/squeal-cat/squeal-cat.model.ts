import { CategoryTypes } from 'app/entities/enumerations/category-types.model';

export interface ISquealCat {
  id: string;
  user_id?: string | null;
  squeal_id?: string | null;
  category?: keyof typeof CategoryTypes | null;
  n_characters?: number | null;
  timestamp?: number | null;
}

export type NewSquealCat = Omit<ISquealCat, 'id'> & { id: null };

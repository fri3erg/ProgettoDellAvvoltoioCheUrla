export interface ICharactersPurchased {
  id: string;
  user_id?: string | null;
  n_characters?: number | null;
  timestamp_bought?: number | null;
  timestamp_expire?: number | null;
  amount?: number | null;
  admin_discount?: boolean | null;
}

export type NewCharactersPurchased = Omit<ICharactersPurchased, 'id'> & { id: null };

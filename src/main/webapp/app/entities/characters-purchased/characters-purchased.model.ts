export interface ICharactersPurchased {
  id: string;
  userId?: string | null;
  nCharacters?: number | null;
  timestampBought?: number | null;
  timestampExpire?: number | null;
  amount?: number | null;
  adminDiscount?: boolean | null;
}

export type NewCharactersPurchased = Omit<ICharactersPurchased, 'id'> & { id: null };

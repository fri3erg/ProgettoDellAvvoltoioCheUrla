export interface IUserChars {
  id: string;
  userId?: string | null;
  maxChars?: number | null;
  remaningChars?: number | null;
}

export type NewUserChars = Omit<IUserChars, 'id'> & { id: null };

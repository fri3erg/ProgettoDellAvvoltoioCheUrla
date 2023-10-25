export interface IUserChars {
  id: string;
  user_id?: string | null;
  max_chars?: number | null;
  remaning_chars?: number | null;
}
export interface IUserCharsDTO {
  type: Type;
  remainingChars?: number | null;
}

export enum Type {
  MONTH,
  WEEK,
  DAY,
}

export type NewUserChars = Omit<IUserChars, 'id'> & { id: null };

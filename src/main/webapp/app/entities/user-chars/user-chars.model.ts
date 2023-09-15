export interface IUserChars {
  id: string;
  userId?: string | null;
  maxChars?: number | null;
  remaningChars?: number | null;
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

export interface ISquealReaction {
  id?: string | null;
  userId?: string | null;
  username?: string | null;
  squealId?: string | null;
  positive?: boolean | null;
  emoji?: string | null;
}

export type NewSquealReaction = Omit<ISquealReaction, 'id'> & { id: null };

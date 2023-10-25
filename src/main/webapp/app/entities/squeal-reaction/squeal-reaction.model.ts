export interface ISquealReaction {
  id?: string | null;
  user_id?: string | null;
  username?: string | null;
  squeal_id?: string | null;
  positive?: boolean | null;
  emoji?: string | null;
}

export type NewSquealReaction = Omit<ISquealReaction, 'id'> & { id: null };

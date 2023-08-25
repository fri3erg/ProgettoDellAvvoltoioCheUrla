export interface ISquealViews {
  id: string;
  squealId?: string | null;
  number?: number | null;
}

export type NewSquealViews = Omit<ISquealViews, 'id'> & { id: null };

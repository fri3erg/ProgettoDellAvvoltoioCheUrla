export interface ISquealViews {
  id: string;
  squeal_id?: string | null;
  number?: number | null;
}

export type NewSquealViews = Omit<ISquealViews, 'id'> & { id: null };

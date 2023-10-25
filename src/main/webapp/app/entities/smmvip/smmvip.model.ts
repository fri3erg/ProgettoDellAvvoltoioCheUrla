export interface ISMMVIP {
  id: string;
  user_id?: string | null;
}

export type NewSMMVIP = Omit<ISMMVIP, 'id'> & { id: null };

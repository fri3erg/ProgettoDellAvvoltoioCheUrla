export interface ISMMVIP {
  id: string;
  userId?: string | null;
}

export type NewSMMVIP = Omit<ISMMVIP, 'id'> & { id: null };

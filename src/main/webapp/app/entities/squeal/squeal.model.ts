export interface ISqueal {
  id: string;
  userId?: string | null;
  timestamp?: number | null;
  body?: string | null;
  img?: string | null;
  imgContentType?: string | null;
  imgName?: string | null;
  videoContentType?: string | null;
  videoName?: string | null;
  nCharacters?: number | null;
  squealIdResponse?: string | null;
  refreshTime?: number | null;
}

export type NewSqueal = Omit<ISqueal, 'id'> & { id: null };

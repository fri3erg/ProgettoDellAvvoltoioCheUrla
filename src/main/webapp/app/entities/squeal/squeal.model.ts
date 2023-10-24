import { ISquealDestination } from '../squeal-destination/squeal-destination.model';

export interface ISqueal {
  id?: string;
  userId?: string | null;
  timestamp?: number | null;
  body?: string | null;
  img?: string | null;
  imgContentType?: string | null;
  imgName?: string | null;
  videoContentType?: string | null;
  videoName?: string | null;
  nCharacters?: number | null;
  n_characters?: number | null;
  squealIdResponse?: string | null;
  refreshTime?: number | null;
  destinations?: ISquealDestination[];
}

export type NewSqueal = Omit<ISqueal, 'id'> & { id: null };

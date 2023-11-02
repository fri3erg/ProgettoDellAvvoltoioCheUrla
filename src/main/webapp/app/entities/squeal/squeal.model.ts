import { ISquealDestination } from '../squeal-destination/squeal-destination.model';

export interface ISqueal {
  _id?: string;
  user_id?: string | null;
  timestamp?: number | null;
  body?: string | null;
  img?: string | null;
  img_content_type?: string | null;
  img_name?: string | null;
  video_content_type?: string | null;
  video_name?: string | null;
  n_characters?: number | null;
  squeal_id_response?: string | null;
  refresh_time?: number | null;
  destination?: ISquealDestination[];
}

export type NewSqueal = Omit<ISqueal, '_id'> & { _id: undefined };

export interface IGeolocationCoordinates {
  id?: string;
  squeal_id?: string | null;
  user_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number | null;
  refresh?: boolean | null;
}

export type NewGeolocationCoordinates = Omit<IGeolocationCoordinates, 'id'> & { id: null };

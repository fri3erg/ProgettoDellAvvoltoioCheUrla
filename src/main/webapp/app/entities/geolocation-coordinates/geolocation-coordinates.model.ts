export interface IGeolocationCoordinates {
  id: string;
  squealId?: string | null;
  userId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number | null;
}

export type NewGeolocationCoordinates = Omit<IGeolocationCoordinates, 'id'> & { id: null };

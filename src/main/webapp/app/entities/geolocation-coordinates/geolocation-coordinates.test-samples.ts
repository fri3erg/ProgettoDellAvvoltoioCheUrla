import { IGeolocationCoordinates, NewGeolocationCoordinates } from './geolocation-coordinates.model';

export const sampleWithRequiredData: IGeolocationCoordinates = {
  id: 'e2afaa03-dc9a-4eb5-ac27-0b1d8ba8e2de',
};

export const sampleWithPartialData: IGeolocationCoordinates = {
  id: '8118a3e6-7b99-48db-9bc3-10604c163411',
  squeal_id: 'quirky Legacy Assimilated',
  user_id: 'virtual content',
  longitude: 183,
  accuracy: 29708,
  heading: 20054,
  timestamp: 4566,
};

export const sampleWithFullData: IGeolocationCoordinates = {
  id: 'd1635965-7827-478d-b44f-5bfd066dfa96',
  squeal_id: 'Hawaii',
  user_id: 'to BMW olive',
  latitude: 11853,
  longitude: 3401,
  accuracy: 16203,
  heading: 29047,
  speed: 354,
  timestamp: 24286,
};

export const sampleWithNewData: NewGeolocationCoordinates = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

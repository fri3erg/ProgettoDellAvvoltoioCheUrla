import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGeolocationCoordinates, NewGeolocationCoordinates } from '../geolocation-coordinates.model';

export type PartialUpdateGeolocationCoordinates = Partial<IGeolocationCoordinates> & Pick<IGeolocationCoordinates, 'id'>;

export type EntityResponseType = HttpResponse<IGeolocationCoordinates>;
export type EntityArrayResponseType = HttpResponse<IGeolocationCoordinates[]>;

@Injectable({ providedIn: 'root' })
export class GeolocationCoordinatesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/geolocation-coordinates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(geolocationCoordinates: NewGeolocationCoordinates): Observable<EntityResponseType> {
    return this.http.post<IGeolocationCoordinates>(this.resourceUrl, geolocationCoordinates, { observe: 'response' });
  }

  update(geolocationCoordinates: IGeolocationCoordinates): Observable<EntityResponseType> {
    return this.http.put<IGeolocationCoordinates>(
      `${this.resourceUrl}/${this.getGeolocationCoordinatesIdentifier(geolocationCoordinates)}`,
      geolocationCoordinates,
      { observe: 'response' }
    );
  }

  partialUpdate(geolocationCoordinates: PartialUpdateGeolocationCoordinates): Observable<EntityResponseType> {
    return this.http.patch<IGeolocationCoordinates>(
      `${this.resourceUrl}/${this.getGeolocationCoordinatesIdentifier(geolocationCoordinates)}`,
      geolocationCoordinates,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IGeolocationCoordinates>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGeolocationCoordinates[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGeolocationCoordinatesIdentifier(geolocationCoordinates: Pick<IGeolocationCoordinates, 'id'>): string {
    return geolocationCoordinates.id;
  }

  compareGeolocationCoordinates(o1: Pick<IGeolocationCoordinates, 'id'> | null, o2: Pick<IGeolocationCoordinates, 'id'> | null): boolean {
    return o1 && o2 ? this.getGeolocationCoordinatesIdentifier(o1) === this.getGeolocationCoordinatesIdentifier(o2) : o1 === o2;
  }

  addGeolocationCoordinatesToCollectionIfMissing<Type extends Pick<IGeolocationCoordinates, 'id'>>(
    geolocationCoordinatesCollection: Type[],
    ...geolocationCoordinatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const geolocationCoordinates: Type[] = geolocationCoordinatesToCheck.filter(isPresent);
    if (geolocationCoordinates.length > 0) {
      const geolocationCoordinatesCollectionIdentifiers = geolocationCoordinatesCollection.map(
        geolocationCoordinatesItem => this.getGeolocationCoordinatesIdentifier(geolocationCoordinatesItem)!
      );
      const geolocationCoordinatesToAdd = geolocationCoordinates.filter(geolocationCoordinatesItem => {
        const geolocationCoordinatesIdentifier = this.getGeolocationCoordinatesIdentifier(geolocationCoordinatesItem);
        if (geolocationCoordinatesCollectionIdentifiers.includes(geolocationCoordinatesIdentifier)) {
          return false;
        }
        geolocationCoordinatesCollectionIdentifiers.push(geolocationCoordinatesIdentifier);
        return true;
      });
      return [...geolocationCoordinatesToAdd, ...geolocationCoordinatesCollection];
    }
    return geolocationCoordinatesCollection;
  }
}

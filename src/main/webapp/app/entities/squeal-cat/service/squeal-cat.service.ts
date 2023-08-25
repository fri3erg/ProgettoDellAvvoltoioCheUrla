import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISquealCat, NewSquealCat } from '../squeal-cat.model';

export type PartialUpdateSquealCat = Partial<ISquealCat> & Pick<ISquealCat, 'id'>;

export type EntityResponseType = HttpResponse<ISquealCat>;
export type EntityArrayResponseType = HttpResponse<ISquealCat[]>;

@Injectable({ providedIn: 'root' })
export class SquealCatService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/squeal-cats');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(squealCat: NewSquealCat): Observable<EntityResponseType> {
    return this.http.post<ISquealCat>(this.resourceUrl, squealCat, { observe: 'response' });
  }

  update(squealCat: ISquealCat): Observable<EntityResponseType> {
    return this.http.put<ISquealCat>(`${this.resourceUrl}/${this.getSquealCatIdentifier(squealCat)}`, squealCat, { observe: 'response' });
  }

  partialUpdate(squealCat: PartialUpdateSquealCat): Observable<EntityResponseType> {
    return this.http.patch<ISquealCat>(`${this.resourceUrl}/${this.getSquealCatIdentifier(squealCat)}`, squealCat, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISquealCat>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISquealCat[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSquealCatIdentifier(squealCat: Pick<ISquealCat, 'id'>): string {
    return squealCat.id;
  }

  compareSquealCat(o1: Pick<ISquealCat, 'id'> | null, o2: Pick<ISquealCat, 'id'> | null): boolean {
    return o1 && o2 ? this.getSquealCatIdentifier(o1) === this.getSquealCatIdentifier(o2) : o1 === o2;
  }

  addSquealCatToCollectionIfMissing<Type extends Pick<ISquealCat, 'id'>>(
    squealCatCollection: Type[],
    ...squealCatsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const squealCats: Type[] = squealCatsToCheck.filter(isPresent);
    if (squealCats.length > 0) {
      const squealCatCollectionIdentifiers = squealCatCollection.map(squealCatItem => this.getSquealCatIdentifier(squealCatItem)!);
      const squealCatsToAdd = squealCats.filter(squealCatItem => {
        const squealCatIdentifier = this.getSquealCatIdentifier(squealCatItem);
        if (squealCatCollectionIdentifiers.includes(squealCatIdentifier)) {
          return false;
        }
        squealCatCollectionIdentifiers.push(squealCatIdentifier);
        return true;
      });
      return [...squealCatsToAdd, ...squealCatCollection];
    }
    return squealCatCollection;
  }
}

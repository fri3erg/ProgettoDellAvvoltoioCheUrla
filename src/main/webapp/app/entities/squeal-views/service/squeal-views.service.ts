import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISquealViews, NewSquealViews } from '../squeal-views.model';

export type PartialUpdateSquealViews = Partial<ISquealViews> & Pick<ISquealViews, 'id'>;

export type EntityResponseType = HttpResponse<ISquealViews>;
export type EntityArrayResponseType = HttpResponse<ISquealViews[]>;

@Injectable({ providedIn: 'root' })
export class SquealViewsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/squeal-views');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(squealViews: NewSquealViews): Observable<EntityResponseType> {
    return this.http.post<ISquealViews>(this.resourceUrl, squealViews, { observe: 'response' });
  }

  update(squealViews: ISquealViews): Observable<EntityResponseType> {
    return this.http.put<ISquealViews>(`${this.resourceUrl}/${this.getSquealViewsIdentifier(squealViews)}`, squealViews, {
      observe: 'response',
    });
  }

  partialUpdate(squealViews: PartialUpdateSquealViews): Observable<EntityResponseType> {
    return this.http.patch<ISquealViews>(`${this.resourceUrl}/${this.getSquealViewsIdentifier(squealViews)}`, squealViews, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISquealViews>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISquealViews[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSquealViewsIdentifier(squealViews: Pick<ISquealViews, 'id'>): string {
    return squealViews.id;
  }

  compareSquealViews(o1: Pick<ISquealViews, 'id'> | null, o2: Pick<ISquealViews, 'id'> | null): boolean {
    return o1 && o2 ? this.getSquealViewsIdentifier(o1) === this.getSquealViewsIdentifier(o2) : o1 === o2;
  }

  addSquealViewsToCollectionIfMissing<Type extends Pick<ISquealViews, 'id'>>(
    squealViewsCollection: Type[],
    ...squealViewsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const squealViews: Type[] = squealViewsToCheck.filter(isPresent);
    if (squealViews.length > 0) {
      const squealViewsCollectionIdentifiers = squealViewsCollection.map(
        squealViewsItem => this.getSquealViewsIdentifier(squealViewsItem)!
      );
      const squealViewsToAdd = squealViews.filter(squealViewsItem => {
        const squealViewsIdentifier = this.getSquealViewsIdentifier(squealViewsItem);
        if (squealViewsCollectionIdentifiers.includes(squealViewsIdentifier)) {
          return false;
        }
        squealViewsCollectionIdentifiers.push(squealViewsIdentifier);
        return true;
      });
      return [...squealViewsToAdd, ...squealViewsCollection];
    }
    return squealViewsCollection;
  }
}

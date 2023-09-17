import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISqueal, NewSqueal } from '../squeal.model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';

export type PartialUpdateSqueal = Partial<ISqueal> & Pick<ISqueal, 'id'>;

export type EntityResponseType = HttpResponse<ISqueal>;
export type EntityArrayResponseType = HttpResponse<ISqueal[]>;

@Injectable({ providedIn: 'root' })
export class SquealService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/squeals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  findDestinations(name: string): Observable<HttpResponse<string[]>> {
    const url = this.applicationConfigService.getEndpointFor(`api/squeals-destination`);
    const params = new HttpParams().append('name', name);
    return this.http.get<string[]>(url, { params, observe: 'response' });
  }

  getSquealByUser(userId: string): Observable<HttpResponse<ISquealDTO[]>> {
    const url = this.applicationConfigService.getEndpointFor(`api/squeal-by-user`);
    const params = new HttpParams().append('id', userId);
    return this.http.get<ISquealDTO[]>(url, { params, observe: 'response' });
  }

  insertOrUpdate(squeal: ISquealDTO): Observable<HttpResponse<ISquealDTO>> {
    return this.http.post<ISquealDTO>(this.resourceUrl, squeal, { observe: 'response' });
  }

  getDirectSqueal(): Observable<HttpResponse<ISquealDTO[]>> {
    const url = this.applicationConfigService.getEndpointFor('api/direct-squeal-preview');

    return this.http.get<ISquealDTO[]>(url, { observe: 'response' });
  }

  listSqueals(page: number, size: number): Observable<HttpResponse<ISquealDTO[]>> {
    const params = new HttpParams().append('page', page).append('size', size);
    const url = this.applicationConfigService.getEndpointFor('api/squeal-list');

    return this.http.get<ISquealDTO[]>(url, { params, observe: 'response' });
  }

  create(squeal: NewSqueal): Observable<EntityResponseType> {
    return this.http.post<ISqueal>(this.resourceUrl, squeal, { observe: 'response' });
  }

  update(squeal: ISqueal): Observable<EntityResponseType> {
    return this.http.put<ISqueal>(`${this.resourceUrl}/${this.getSquealIdentifier(squeal)}`, squeal, { observe: 'response' });
  }

  partialUpdate(squeal: PartialUpdateSqueal): Observable<EntityResponseType> {
    return this.http.patch<ISqueal>(`${this.resourceUrl}/${this.getSquealIdentifier(squeal)}`, squeal, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISqueal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISqueal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSquealIdentifier(squeal: Pick<ISqueal, 'id'>): string {
    return squeal.id ?? '';
  }

  compareSqueal(o1: Pick<ISqueal, 'id'> | null, o2: Pick<ISqueal, 'id'> | null): boolean {
    return o1 && o2 ? this.getSquealIdentifier(o1) === this.getSquealIdentifier(o2) : o1 === o2;
  }

  addSquealToCollectionIfMissing<Type extends Pick<ISqueal, 'id'>>(
    squealCollection: Type[],
    ...squealsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const squeals: Type[] = squealsToCheck.filter(isPresent);
    if (squeals.length > 0) {
      const squealCollectionIdentifiers = squealCollection.map(squealItem => this.getSquealIdentifier(squealItem)!);
      const squealsToAdd = squeals.filter(squealItem => {
        const squealIdentifier = this.getSquealIdentifier(squealItem);
        if (squealCollectionIdentifiers.includes(squealIdentifier)) {
          return false;
        }
        squealCollectionIdentifiers.push(squealIdentifier);
        return true;
      });
      return [...squealsToAdd, ...squealCollection];
    }
    return squealCollection;
  }
}

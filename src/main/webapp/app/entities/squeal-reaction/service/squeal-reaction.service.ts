import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISquealReaction, NewSquealReaction } from '../squeal-reaction.model';
import { IReactionDTO } from 'app/shared/model/squealDTO-model';

export type PartialUpdateSquealReaction = Partial<ISquealReaction> & Pick<ISquealReaction, 'id'>;

export type EntityResponseType = HttpResponse<ISquealReaction>;
export type EntityArrayResponseType = HttpResponse<ISquealReaction[]>;

@Injectable({ providedIn: 'root' })
export class SquealReactionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/squeal-reactions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(squealReaction: ISquealReaction): Observable<EntityResponseType> {
    return this.http.post<ISquealReaction>(this.resourceUrl, squealReaction, { observe: 'response' });
  }

  createorUpdate(squealReaction: ISquealReaction): Observable<HttpResponse<ISquealReaction>> {
    return this.http.post<ISquealReaction>('api/squeal-reaction/create', squealReaction, { observe: 'response' });
  }

  update(squealReaction: ISquealReaction): Observable<EntityResponseType> {
    return this.http.put<ISquealReaction>(`${this.resourceUrl}/${this.getSquealReactionIdentifier(squealReaction)}`, squealReaction, {
      observe: 'response',
    });
  }

  partialUpdate(squealReaction: PartialUpdateSquealReaction): Observable<EntityResponseType> {
    return this.http.patch<ISquealReaction>(`${this.resourceUrl}/${this.getSquealReactionIdentifier(squealReaction)}`, squealReaction, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISquealReaction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISquealReaction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSquealReactionIdentifier(squealReaction: Pick<ISquealReaction, 'id'>): string {
    return squealReaction.id ?? '';
  }

  compareSquealReaction(o1: Pick<ISquealReaction, 'id'> | null, o2: Pick<ISquealReaction, 'id'> | null): boolean {
    return o1 && o2 ? this.getSquealReactionIdentifier(o1) === this.getSquealReactionIdentifier(o2) : o1 === o2;
  }

  addSquealReactionToCollectionIfMissing<Type extends Pick<ISquealReaction, 'id'>>(
    squealReactionCollection: Type[],
    ...squealReactionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const squealReactions: Type[] = squealReactionsToCheck.filter(isPresent);
    if (squealReactions.length > 0) {
      const squealReactionCollectionIdentifiers = squealReactionCollection.map(
        squealReactionItem => this.getSquealReactionIdentifier(squealReactionItem)!
      );
      const squealReactionsToAdd = squealReactions.filter(squealReactionItem => {
        const squealReactionIdentifier = this.getSquealReactionIdentifier(squealReactionItem);
        if (squealReactionCollectionIdentifiers.includes(squealReactionIdentifier)) {
          return false;
        }
        squealReactionCollectionIdentifiers.push(squealReactionIdentifier);
        return true;
      });
      return [...squealReactionsToAdd, ...squealReactionCollection];
    }
    return squealReactionCollection;
  }
}

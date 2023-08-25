import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharactersPurchased, NewCharactersPurchased } from '../characters-purchased.model';

export type PartialUpdateCharactersPurchased = Partial<ICharactersPurchased> & Pick<ICharactersPurchased, 'id'>;

export type EntityResponseType = HttpResponse<ICharactersPurchased>;
export type EntityArrayResponseType = HttpResponse<ICharactersPurchased[]>;

@Injectable({ providedIn: 'root' })
export class CharactersPurchasedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/characters-purchaseds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charactersPurchased: NewCharactersPurchased): Observable<EntityResponseType> {
    return this.http.post<ICharactersPurchased>(this.resourceUrl, charactersPurchased, { observe: 'response' });
  }

  update(charactersPurchased: ICharactersPurchased): Observable<EntityResponseType> {
    return this.http.put<ICharactersPurchased>(
      `${this.resourceUrl}/${this.getCharactersPurchasedIdentifier(charactersPurchased)}`,
      charactersPurchased,
      { observe: 'response' }
    );
  }

  partialUpdate(charactersPurchased: PartialUpdateCharactersPurchased): Observable<EntityResponseType> {
    return this.http.patch<ICharactersPurchased>(
      `${this.resourceUrl}/${this.getCharactersPurchasedIdentifier(charactersPurchased)}`,
      charactersPurchased,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ICharactersPurchased>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharactersPurchased[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCharactersPurchasedIdentifier(charactersPurchased: Pick<ICharactersPurchased, 'id'>): string {
    return charactersPurchased.id;
  }

  compareCharactersPurchased(o1: Pick<ICharactersPurchased, 'id'> | null, o2: Pick<ICharactersPurchased, 'id'> | null): boolean {
    return o1 && o2 ? this.getCharactersPurchasedIdentifier(o1) === this.getCharactersPurchasedIdentifier(o2) : o1 === o2;
  }

  addCharactersPurchasedToCollectionIfMissing<Type extends Pick<ICharactersPurchased, 'id'>>(
    charactersPurchasedCollection: Type[],
    ...charactersPurchasedsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charactersPurchaseds: Type[] = charactersPurchasedsToCheck.filter(isPresent);
    if (charactersPurchaseds.length > 0) {
      const charactersPurchasedCollectionIdentifiers = charactersPurchasedCollection.map(
        charactersPurchasedItem => this.getCharactersPurchasedIdentifier(charactersPurchasedItem)!
      );
      const charactersPurchasedsToAdd = charactersPurchaseds.filter(charactersPurchasedItem => {
        const charactersPurchasedIdentifier = this.getCharactersPurchasedIdentifier(charactersPurchasedItem);
        if (charactersPurchasedCollectionIdentifiers.includes(charactersPurchasedIdentifier)) {
          return false;
        }
        charactersPurchasedCollectionIdentifiers.push(charactersPurchasedIdentifier);
        return true;
      });
      return [...charactersPurchasedsToAdd, ...charactersPurchasedCollection];
    }
    return charactersPurchasedCollection;
  }
}

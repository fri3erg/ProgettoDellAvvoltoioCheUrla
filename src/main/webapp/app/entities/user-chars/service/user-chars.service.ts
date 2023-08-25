import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserChars, NewUserChars } from '../user-chars.model';

export type PartialUpdateUserChars = Partial<IUserChars> & Pick<IUserChars, 'id'>;

export type EntityResponseType = HttpResponse<IUserChars>;
export type EntityArrayResponseType = HttpResponse<IUserChars[]>;

@Injectable({ providedIn: 'root' })
export class UserCharsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-chars');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userChars: NewUserChars): Observable<EntityResponseType> {
    return this.http.post<IUserChars>(this.resourceUrl, userChars, { observe: 'response' });
  }

  update(userChars: IUserChars): Observable<EntityResponseType> {
    return this.http.put<IUserChars>(`${this.resourceUrl}/${this.getUserCharsIdentifier(userChars)}`, userChars, { observe: 'response' });
  }

  partialUpdate(userChars: PartialUpdateUserChars): Observable<EntityResponseType> {
    return this.http.patch<IUserChars>(`${this.resourceUrl}/${this.getUserCharsIdentifier(userChars)}`, userChars, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IUserChars>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserChars[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserCharsIdentifier(userChars: Pick<IUserChars, 'id'>): string {
    return userChars.id;
  }

  compareUserChars(o1: Pick<IUserChars, 'id'> | null, o2: Pick<IUserChars, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserCharsIdentifier(o1) === this.getUserCharsIdentifier(o2) : o1 === o2;
  }

  addUserCharsToCollectionIfMissing<Type extends Pick<IUserChars, 'id'>>(
    userCharsCollection: Type[],
    ...userCharsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userChars: Type[] = userCharsToCheck.filter(isPresent);
    if (userChars.length > 0) {
      const userCharsCollectionIdentifiers = userCharsCollection.map(userCharsItem => this.getUserCharsIdentifier(userCharsItem)!);
      const userCharsToAdd = userChars.filter(userCharsItem => {
        const userCharsIdentifier = this.getUserCharsIdentifier(userCharsItem);
        if (userCharsCollectionIdentifiers.includes(userCharsIdentifier)) {
          return false;
        }
        userCharsCollectionIdentifiers.push(userCharsIdentifier);
        return true;
      });
      return [...userCharsToAdd, ...userCharsCollection];
    }
    return userCharsCollection;
  }
}

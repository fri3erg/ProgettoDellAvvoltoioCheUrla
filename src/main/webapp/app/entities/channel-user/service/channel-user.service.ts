import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChannelUser, NewChannelUser } from '../channel-user.model';

export type PartialUpdateChannelUser = Partial<IChannelUser> & Pick<IChannelUser, 'id'>;

export type EntityResponseType = HttpResponse<IChannelUser>;
export type EntityArrayResponseType = HttpResponse<IChannelUser[]>;

@Injectable({ providedIn: 'root' })
export class ChannelUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/channel-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  sub(id: string): Observable<EntityResponseType> {
    return this.http.get<IChannelUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  update(channelUser: IChannelUser): Observable<EntityResponseType> {
    return this.http.put<IChannelUser>(`${this.resourceUrl}/${this.getChannelUserIdentifier(channelUser)}`, channelUser, {
      observe: 'response',
    });
  }

  partialUpdate(channelUser: PartialUpdateChannelUser): Observable<EntityResponseType> {
    return this.http.patch<IChannelUser>(`${this.resourceUrl}/${this.getChannelUserIdentifier(channelUser)}`, channelUser, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IChannelUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChannelUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChannelUserIdentifier(channelUser: Pick<IChannelUser, 'id'>): string {
    return channelUser.id;
  }

  compareChannelUser(o1: Pick<IChannelUser, 'id'> | null, o2: Pick<IChannelUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getChannelUserIdentifier(o1) === this.getChannelUserIdentifier(o2) : o1 === o2;
  }

  addChannelUserToCollectionIfMissing<Type extends Pick<IChannelUser, 'id'>>(
    channelUserCollection: Type[],
    ...channelUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const channelUsers: Type[] = channelUsersToCheck.filter(isPresent);
    if (channelUsers.length > 0) {
      const channelUserCollectionIdentifiers = channelUserCollection.map(
        channelUserItem => this.getChannelUserIdentifier(channelUserItem)!
      );
      const channelUsersToAdd = channelUsers.filter(channelUserItem => {
        const channelUserIdentifier = this.getChannelUserIdentifier(channelUserItem);
        if (channelUserCollectionIdentifiers.includes(channelUserIdentifier)) {
          return false;
        }
        channelUserCollectionIdentifiers.push(channelUserIdentifier);
        return true;
      });
      return [...channelUsersToAdd, ...channelUserCollection];
    }
    return channelUserCollection;
  }
}

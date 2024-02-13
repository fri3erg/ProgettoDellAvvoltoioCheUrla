import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChannel, NewChannel } from '../channel.model';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { Account } from 'app/core/auth/account.model';
import { IChannelUser } from 'app/entities/channel-user/channel-user.model';

export type PartialUpdateChannel = Partial<IChannel> & Pick<IChannel, '_id'>;

export type EntityResponseType = HttpResponse<IChannel>;
export type EntityArrayResponseType = HttpResponse<IChannel[]>;

@Injectable({ providedIn: 'root' })
export class ChannelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/channels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getUsersSubbedToChannel(id: string): Observable<HttpResponse<Account[]>> {
    return this.http.get<Account[]>(`api/channels/get-subscribed/${id}`, { observe: 'response' });
  }

  countUsersFollowing(id: string): Observable<HttpResponse<number>> {
    return this.http.get<number>(`api/channels/countSubs/${id}`, { observe: 'response' });
  }

  getChannelsUserIsSubbed(name: string): Observable<HttpResponse<IChannelDTO[]>> {
    return this.http.get<IChannelDTO[]>(`api/channels/sub/get/${name}`, { observe: 'response' });
  }

  addPeople(ids: string[], channelId: string): Observable<HttpResponse<IChannelUser[]>> {
    const params = new HttpParams().append('channelId', channelId);
    return this.http.post<IChannelUser[]>(`api/channels/add-people`, ids, { params, observe: 'response' });
  }

  countChannelsUserIsSubbed(name: string): Observable<HttpResponse<number>> {
    const url = this.applicationConfigService.getEndpointFor(`api/channels/sub/count/${name}`);
    return this.http.get<number>(url, { observe: 'response' });
  }

  findDTO(name: string): Observable<HttpResponse<IChannelDTO>> {
    return this.http.get<IChannelDTO>(`${this.resourceUrl}/${name}`, { observe: 'response' });
  }

  insertOrUpdate(channel: IChannelDTO): Observable<HttpResponse<IChannelDTO>> {
    return this.http.post<IChannelDTO>(this.resourceUrl, channel, { observe: 'response' });
  }

  search(name: string): Observable<HttpResponse<IChannelDTO[]>> {
    const url = this.applicationConfigService.getEndpointFor('api/channel-search');
    const params = new HttpParams().append('name', name);
    return this.http.get<IChannelDTO[]>(url, { params, observe: 'response' });
  }

  create(channel: NewChannel): Observable<EntityResponseType> {
    return this.http.post<IChannel>(this.resourceUrl, channel, { observe: 'response' });
  }

  update(channel?: IChannel): Observable<EntityResponseType> {
    const url = this.applicationConfigService.getEndpointFor('api/channels/edit-description');
    return this.http.post<IChannel>(url, channel, { observe: 'response' });
  }

  partialUpdate(channel: PartialUpdateChannel): Observable<EntityResponseType> {
    return this.http.patch<IChannel>(`${this.resourceUrl}/${this.getChannelIdentifier(channel)}`, channel, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IChannel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChannel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChannelIdentifier(channel: Pick<IChannel, '_id'>): string {
    return channel._id ?? '';
  }

  compareChannel(o1: Pick<IChannel, '_id'> | null, o2: Pick<IChannel, '_id'> | null): boolean {
    return o1 && o2 ? this.getChannelIdentifier(o1) === this.getChannelIdentifier(o2) : o1 === o2;
  }

  addChannelToCollectionIfMissing<Type extends Pick<IChannel, '_id'>>(
    channelCollection: Type[],
    ...channelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const channels: Type[] = channelsToCheck.filter(isPresent);
    if (channels.length > 0) {
      const channelCollectionIdentifiers = channelCollection.map(channelItem => this.getChannelIdentifier(channelItem)!);
      const channelsToAdd = channels.filter(channelItem => {
        const channelIdentifier = this.getChannelIdentifier(channelItem);
        if (channelCollectionIdentifiers.includes(channelIdentifier)) {
          return false;
        }
        channelCollectionIdentifiers.push(channelIdentifier);
        return true;
      });
      return [...channelsToAdd, ...channelCollection];
    }
    return channelCollection;
  }
}

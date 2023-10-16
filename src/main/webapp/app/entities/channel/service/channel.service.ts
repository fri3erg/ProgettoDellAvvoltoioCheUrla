import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChannel, NewChannel } from '../channel.model';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';

export type PartialUpdateChannel = Partial<IChannel> & Pick<IChannel, 'id'>;

export type EntityResponseType = HttpResponse<IChannel>;
export type EntityArrayResponseType = HttpResponse<IChannel[]>;

@Injectable({ providedIn: 'root' })
export class ChannelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/channels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  countUsersFollowing(id: string): Observable<HttpResponse<number>> {
    return this.http.get<number>(`api/channels/countSubs/${id}`, { observe: 'response' });
  }

  getSubscribed(id: string): Observable<HttpResponse<IChannelDTO[]>> {
    return this.http.get<IChannelDTO[]>(`api/channels/sub/get/${id}`, { observe: 'response' });
  }

  countChannelSubscribed(id: string): Observable<HttpResponse<number>> {
    const url = this.applicationConfigService.getEndpointFor(`api/channels/sub/count/${id}`);
    return this.http.get<number>(url, { observe: 'response' });
  }

  findDTO(id: string): Observable<HttpResponse<IChannelDTO>> {
    return this.http.get<IChannelDTO>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  insertOrUpdate(channel: IChannelDTO): Observable<HttpResponse<IChannelDTO>> {
    return this.http.post<IChannelDTO>(this.resourceUrl, channel, { observe: 'response' });
  }

  search(name: string): Observable<HttpResponse<IChannelDTO[]>> {
    const url = this.applicationConfigService.getEndpointFor('api/channel-search');
    return this.http.get<IChannelDTO[]>(`${url}/${name}`, { observe: 'response' });
  }

  create(channel: NewChannel): Observable<EntityResponseType> {
    return this.http.post<IChannel>(this.resourceUrl, channel, { observe: 'response' });
  }

  update(channel: IChannel): Observable<EntityResponseType> {
    return this.http.put<IChannel>(`${this.resourceUrl}/${this.getChannelIdentifier(channel)}`, channel, { observe: 'response' });
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

  getChannelIdentifier(channel: Pick<IChannel, 'id'>): string {
    return channel.id ?? '';
  }

  compareChannel(o1: Pick<IChannel, 'id'> | null, o2: Pick<IChannel, 'id'> | null): boolean {
    return o1 && o2 ? this.getChannelIdentifier(o1) === this.getChannelIdentifier(o2) : o1 === o2;
  }

  addChannelToCollectionIfMissing<Type extends Pick<IChannel, 'id'>>(
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

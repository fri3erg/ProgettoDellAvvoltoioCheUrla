import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ChannelService } from 'app/entities/channel/service/channel.service';

export const channelDtoResolve = (route: ActivatedRouteSnapshot): Observable<null | IChannelDTO> => {
  const id = route.params['id'];
  if (id) {
    return inject(ChannelService)
      .findDTO(id)
      .pipe(
        mergeMap((channel: HttpResponse<IChannelDTO>) => {
          if (channel.body) {
            return of(channel.body);
          } else {
            const c: IChannelDTO = { channel: {}, users: [] };
            return of(c);
          }
        })
      );
  }
  const c: IChannelDTO = { channel: {}, users: [] };
  return of(c);
};

export default channelDtoResolve;

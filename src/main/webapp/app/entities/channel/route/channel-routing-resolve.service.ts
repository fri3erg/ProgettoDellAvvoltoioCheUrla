import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChannel } from '../channel.model';
import { ChannelService } from '../service/channel.service';

export const channelResolve = (route: ActivatedRouteSnapshot): Observable<null | IChannel> => {
  const id = route.params['id'];
  if (id) {
    return inject(ChannelService)
      .find(id)
      .pipe(
        mergeMap((channel: HttpResponse<IChannel>) => {
          if (channel.body) {
            return of(channel.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default channelResolve;

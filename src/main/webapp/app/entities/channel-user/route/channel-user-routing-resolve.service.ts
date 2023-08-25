import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChannelUser } from '../channel-user.model';
import { ChannelUserService } from '../service/channel-user.service';

export const channelUserResolve = (route: ActivatedRouteSnapshot): Observable<null | IChannelUser> => {
  const id = route.params['id'];
  if (id) {
    return inject(ChannelUserService)
      .find(id)
      .pipe(
        mergeMap((channelUser: HttpResponse<IChannelUser>) => {
          if (channelUser.body) {
            return of(channelUser.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default channelUserResolve;

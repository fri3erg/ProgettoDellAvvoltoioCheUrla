import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISMMVIP } from '../smmvip.model';
import { SMMVIPService } from '../service/smmvip.service';

export const sMMVIPResolve = (route: ActivatedRouteSnapshot): Observable<null | ISMMVIP> => {
  const id = route.params['id'];
  if (id) {
    return inject(SMMVIPService)
      .find(id)
      .pipe(
        mergeMap((sMMVIP: HttpResponse<ISMMVIP>) => {
          if (sMMVIP.body) {
            return of(sMMVIP.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default sMMVIPResolve;

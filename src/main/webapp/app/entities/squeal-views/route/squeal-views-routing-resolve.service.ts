import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISquealViews } from '../squeal-views.model';
import { SquealViewsService } from '../service/squeal-views.service';

export const squealViewsResolve = (route: ActivatedRouteSnapshot): Observable<null | ISquealViews> => {
  const id = route.params['id'];
  if (id) {
    return inject(SquealViewsService)
      .find(id)
      .pipe(
        mergeMap((squealViews: HttpResponse<ISquealViews>) => {
          if (squealViews.body) {
            return of(squealViews.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default squealViewsResolve;

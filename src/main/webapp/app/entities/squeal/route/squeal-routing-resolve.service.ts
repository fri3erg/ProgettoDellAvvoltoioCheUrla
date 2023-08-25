import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISqueal } from '../squeal.model';
import { SquealService } from '../service/squeal.service';

export const squealResolve = (route: ActivatedRouteSnapshot): Observable<null | ISqueal> => {
  const id = route.params['id'];
  if (id) {
    return inject(SquealService)
      .find(id)
      .pipe(
        mergeMap((squeal: HttpResponse<ISqueal>) => {
          if (squeal.body) {
            return of(squeal.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default squealResolve;

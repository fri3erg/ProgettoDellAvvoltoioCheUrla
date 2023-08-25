import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISquealCat } from '../squeal-cat.model';
import { SquealCatService } from '../service/squeal-cat.service';

export const squealCatResolve = (route: ActivatedRouteSnapshot): Observable<null | ISquealCat> => {
  const id = route.params['id'];
  if (id) {
    return inject(SquealCatService)
      .find(id)
      .pipe(
        mergeMap((squealCat: HttpResponse<ISquealCat>) => {
          if (squealCat.body) {
            return of(squealCat.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default squealCatResolve;

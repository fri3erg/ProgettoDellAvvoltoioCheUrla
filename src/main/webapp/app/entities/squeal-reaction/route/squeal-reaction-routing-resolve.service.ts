import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISquealReaction } from '../squeal-reaction.model';
import { SquealReactionService } from '../service/squeal-reaction.service';

export const squealReactionResolve = (route: ActivatedRouteSnapshot): Observable<null | ISquealReaction> => {
  const id = route.params['id'];
  if (id) {
    return inject(SquealReactionService)
      .find(id)
      .pipe(
        mergeMap((squealReaction: HttpResponse<ISquealReaction>) => {
          if (squealReaction.body) {
            return of(squealReaction.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default squealReactionResolve;

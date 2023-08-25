import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserChars } from '../user-chars.model';
import { UserCharsService } from '../service/user-chars.service';

export const userCharsResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserChars> => {
  const id = route.params['id'];
  if (id) {
    return inject(UserCharsService)
      .find(id)
      .pipe(
        mergeMap((userChars: HttpResponse<IUserChars>) => {
          if (userChars.body) {
            return of(userChars.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default userCharsResolve;

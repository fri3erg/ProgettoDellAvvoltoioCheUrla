import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGeolocationCoordinates } from '../geolocation-coordinates.model';
import { GeolocationCoordinatesService } from '../service/geolocation-coordinates.service';

export const geolocationCoordinatesResolve = (route: ActivatedRouteSnapshot): Observable<null | IGeolocationCoordinates> => {
  const id = route.params['id'];
  if (id) {
    return inject(GeolocationCoordinatesService)
      .find(id)
      .pipe(
        mergeMap((geolocationCoordinates: HttpResponse<IGeolocationCoordinates>) => {
          if (geolocationCoordinates.body) {
            return of(geolocationCoordinates.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default geolocationCoordinatesResolve;

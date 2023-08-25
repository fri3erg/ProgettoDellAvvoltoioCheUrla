import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GeolocationCoordinatesComponent } from './list/geolocation-coordinates.component';
import { GeolocationCoordinatesDetailComponent } from './detail/geolocation-coordinates-detail.component';
import { GeolocationCoordinatesUpdateComponent } from './update/geolocation-coordinates-update.component';
import GeolocationCoordinatesResolve from './route/geolocation-coordinates-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const geolocationCoordinatesRoute: Routes = [
  {
    path: '',
    component: GeolocationCoordinatesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GeolocationCoordinatesDetailComponent,
    resolve: {
      geolocationCoordinates: GeolocationCoordinatesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GeolocationCoordinatesUpdateComponent,
    resolve: {
      geolocationCoordinates: GeolocationCoordinatesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GeolocationCoordinatesUpdateComponent,
    resolve: {
      geolocationCoordinates: GeolocationCoordinatesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default geolocationCoordinatesRoute;

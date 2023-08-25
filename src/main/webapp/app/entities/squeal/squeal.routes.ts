import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SquealComponent } from './list/squeal.component';
import { SquealDetailComponent } from './detail/squeal-detail.component';
import { SquealUpdateComponent } from './update/squeal-update.component';
import SquealResolve from './route/squeal-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const squealRoute: Routes = [
  {
    path: '',
    component: SquealComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SquealDetailComponent,
    resolve: {
      squeal: SquealResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SquealUpdateComponent,
    resolve: {
      squeal: SquealResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SquealUpdateComponent,
    resolve: {
      squeal: SquealResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default squealRoute;

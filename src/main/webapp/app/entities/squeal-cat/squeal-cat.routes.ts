import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SquealCatComponent } from './list/squeal-cat.component';
import { SquealCatDetailComponent } from './detail/squeal-cat-detail.component';
import { SquealCatUpdateComponent } from './update/squeal-cat-update.component';
import SquealCatResolve from './route/squeal-cat-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const squealCatRoute: Routes = [
  {
    path: '',
    component: SquealCatComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SquealCatDetailComponent,
    resolve: {
      squealCat: SquealCatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SquealCatUpdateComponent,
    resolve: {
      squealCat: SquealCatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SquealCatUpdateComponent,
    resolve: {
      squealCat: SquealCatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default squealCatRoute;

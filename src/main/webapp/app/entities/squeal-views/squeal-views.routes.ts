import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SquealViewsComponent } from './list/squeal-views.component';
import { SquealViewsDetailComponent } from './detail/squeal-views-detail.component';
import { SquealViewsUpdateComponent } from './update/squeal-views-update.component';
import SquealViewsResolve from './route/squeal-views-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const squealViewsRoute: Routes = [
  {
    path: '',
    component: SquealViewsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SquealViewsDetailComponent,
    resolve: {
      squealViews: SquealViewsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SquealViewsUpdateComponent,
    resolve: {
      squealViews: SquealViewsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SquealViewsUpdateComponent,
    resolve: {
      squealViews: SquealViewsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default squealViewsRoute;

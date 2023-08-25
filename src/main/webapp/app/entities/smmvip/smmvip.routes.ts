import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SMMVIPComponent } from './list/smmvip.component';
import { SMMVIPDetailComponent } from './detail/smmvip-detail.component';
import { SMMVIPUpdateComponent } from './update/smmvip-update.component';
import SMMVIPResolve from './route/smmvip-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sMMVIPRoute: Routes = [
  {
    path: '',
    component: SMMVIPComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SMMVIPDetailComponent,
    resolve: {
      sMMVIP: SMMVIPResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SMMVIPUpdateComponent,
    resolve: {
      sMMVIP: SMMVIPResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SMMVIPUpdateComponent,
    resolve: {
      sMMVIP: SMMVIPResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sMMVIPRoute;

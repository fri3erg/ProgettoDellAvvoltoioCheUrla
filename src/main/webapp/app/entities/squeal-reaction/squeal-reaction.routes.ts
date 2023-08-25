import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SquealReactionComponent } from './list/squeal-reaction.component';
import { SquealReactionDetailComponent } from './detail/squeal-reaction-detail.component';
import { SquealReactionUpdateComponent } from './update/squeal-reaction-update.component';
import SquealReactionResolve from './route/squeal-reaction-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const squealReactionRoute: Routes = [
  {
    path: '',
    component: SquealReactionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SquealReactionDetailComponent,
    resolve: {
      squealReaction: SquealReactionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SquealReactionUpdateComponent,
    resolve: {
      squealReaction: SquealReactionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SquealReactionUpdateComponent,
    resolve: {
      squealReaction: SquealReactionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default squealReactionRoute;

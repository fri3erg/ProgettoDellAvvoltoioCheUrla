import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserCharsComponent } from './list/user-chars.component';
import { UserCharsDetailComponent } from './detail/user-chars-detail.component';
import { UserCharsUpdateComponent } from './update/user-chars-update.component';
import UserCharsResolve from './route/user-chars-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userCharsRoute: Routes = [
  {
    path: '',
    component: UserCharsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserCharsDetailComponent,
    resolve: {
      userChars: UserCharsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserCharsUpdateComponent,
    resolve: {
      userChars: UserCharsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserCharsUpdateComponent,
    resolve: {
      userChars: UserCharsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userCharsRoute;

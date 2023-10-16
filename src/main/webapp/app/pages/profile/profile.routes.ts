import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProfileComponent } from './profile.component';
import { MyChannelsComponent } from './my-channels/my-channels.component';

const profileRoute: Routes = [
  {
    path: ':id',
    component: ProfileComponent,
  },
  {
    path: ':id/mychannels',
    component: MyChannelsComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default profileRoute;

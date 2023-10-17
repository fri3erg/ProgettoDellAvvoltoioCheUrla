import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProfileComponent } from './profile.component';
import { MyChannelsComponent } from '../channel/my-channels/my-channels.component';

const profileRoute: Routes = [
  {
    path: '',
    component: ProfileComponent,
    title: '',
  },
  {
    path: ':name',
    component: ProfileComponent,
  },
  {
    path: ':name/mychannels',
    component: MyChannelsComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default profileRoute;

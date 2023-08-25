import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChannelUserComponent } from './list/channel-user.component';
import { ChannelUserDetailComponent } from './detail/channel-user-detail.component';
import { ChannelUserUpdateComponent } from './update/channel-user-update.component';
import ChannelUserResolve from './route/channel-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const channelUserRoute: Routes = [
  {
    path: '',
    component: ChannelUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChannelUserDetailComponent,
    resolve: {
      channelUser: ChannelUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChannelUserUpdateComponent,
    resolve: {
      channelUser: ChannelUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChannelUserUpdateComponent,
    resolve: {
      channelUser: ChannelUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default channelUserRoute;

import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChannelComponent } from './list/channel.component';
import { ChannelDetailComponent } from './detail/channel-detail.component';
import { ChannelUpdateComponent } from './update/channel-update.component';
import ChannelResolve from './route/channel-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const channelRoute: Routes = [
  {
    path: '',
    component: ChannelComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChannelDetailComponent,
    resolve: {
      channel: ChannelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChannelUpdateComponent,
    resolve: {
      channel: ChannelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChannelUpdateComponent,
    resolve: {
      channel: ChannelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default channelRoute;

import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { ChannelViewComponent } from './channel-view/channel-view.component';
import channelDtoResolve from './channel-dto-routing-resolve.service';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';

const channelRoute: Routes = [
  {
    path: '',
    component: ChannelListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChannelViewComponent,
    resolve: {
      channel: channelDtoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChannelEditComponent,
    resolve: {
      channel: channelDtoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChannelEditComponent,
    resolve: {
      channel: channelDtoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default channelRoute;

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonalMessagesComponent } from './direct-message/personal-messages/personal-messages.component';
import { MyChannelsComponent } from './channel/my-channels/my-channels.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'direct-message',
        data: { pageTitle: 'Direct-Message' },
        loadChildren: () => import('./direct-message/direct-message.routes'),
      },
      {
        path: 'profile',
        data: { pageTitle: 'Profile' },
        loadChildren: () => import('./profile/profile.routes'),
      },
      {
        path: 'channels',
        data: { pageTitle: 'Channels' },
        loadChildren: () => import('./channel/channel-dto.routes'),
      },
    ]),
  ],
})
export class PageRoutingModule {}

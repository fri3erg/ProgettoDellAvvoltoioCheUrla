import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DirectMessageComponent } from './direct-message/direct-message.component';
import { PersonalMessagesComponent } from './direct-message/personal-messages/personal-messages.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'user/id', component: PersonalMessagesComponent, title: 'direct messages' },
      {
        path: 'channels',
        data: { pageTitle: 'Channels' },
        loadChildren: () => import('./channel/channel-dto.routes'),
      },
    ]),
  ],
})
export class PageRoutingModule {}

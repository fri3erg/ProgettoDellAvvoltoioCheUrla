import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonalMessagesComponent } from './direct-message/personal-messages/personal-messages.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user/:id',
        component: PersonalMessagesComponent,
        title: 'direct messages' 
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

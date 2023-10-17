import { Routes } from '@angular/router';
import { PersonalMessagesComponent } from './personal-messages/personal-messages.component';
import { DirectMessageComponent } from './direct-message/direct-message.component';

const messageRoute: Routes = [
  {
    path: 'user/:username',
    component: PersonalMessagesComponent,
    title: 'direct messages',
  },
  {
    path: '',
    component: DirectMessageComponent,
    title: '',
  },
];

export default messageRoute;

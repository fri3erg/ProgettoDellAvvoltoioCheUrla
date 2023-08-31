import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'channels',
        data: { pageTitle: 'Channels' },
        loadChildren: () => import('./channel/channel-dto.routes'),
      },
    ]),
  ],
})
export class PageRoutingModule {}

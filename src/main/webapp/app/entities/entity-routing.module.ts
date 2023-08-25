import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'channel',
        data: { pageTitle: 'Channels' },
        loadChildren: () => import('./channel/channel.routes'),
      },
      {
        path: 'channel-user',
        data: { pageTitle: 'ChannelUsers' },
        loadChildren: () => import('./channel-user/channel-user.routes'),
      },
      {
        path: 'characters-purchased',
        data: { pageTitle: 'CharactersPurchaseds' },
        loadChildren: () => import('./characters-purchased/characters-purchased.routes'),
      },
      {
        path: 'geolocation-coordinates',
        data: { pageTitle: 'GeolocationCoordinates' },
        loadChildren: () => import('./geolocation-coordinates/geolocation-coordinates.routes'),
      },
      {
        path: 'smmvip',
        data: { pageTitle: 'SMMVIPS' },
        loadChildren: () => import('./smmvip/smmvip.routes'),
      },
      {
        path: 'squeal',
        data: { pageTitle: 'Squeals' },
        loadChildren: () => import('./squeal/squeal.routes'),
      },
      {
        path: 'squeal-cat',
        data: { pageTitle: 'SquealCats' },
        loadChildren: () => import('./squeal-cat/squeal-cat.routes'),
      },
      {
        path: 'squeal-reaction',
        data: { pageTitle: 'SquealReactions' },
        loadChildren: () => import('./squeal-reaction/squeal-reaction.routes'),
      },
      {
        path: 'squeal-views',
        data: { pageTitle: 'SquealViews' },
        loadChildren: () => import('./squeal-views/squeal-views.routes'),
      },
      {
        path: 'user-chars',
        data: { pageTitle: 'UserChars' },
        loadChildren: () => import('./user-chars/user-chars.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

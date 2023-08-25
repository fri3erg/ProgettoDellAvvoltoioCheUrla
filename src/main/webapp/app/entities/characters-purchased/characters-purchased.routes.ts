import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CharactersPurchasedComponent } from './list/characters-purchased.component';
import { CharactersPurchasedDetailComponent } from './detail/characters-purchased-detail.component';
import { CharactersPurchasedUpdateComponent } from './update/characters-purchased-update.component';
import CharactersPurchasedResolve from './route/characters-purchased-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const charactersPurchasedRoute: Routes = [
  {
    path: '',
    component: CharactersPurchasedComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CharactersPurchasedDetailComponent,
    resolve: {
      charactersPurchased: CharactersPurchasedResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CharactersPurchasedUpdateComponent,
    resolve: {
      charactersPurchased: CharactersPurchasedResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CharactersPurchasedUpdateComponent,
    resolve: {
      charactersPurchased: CharactersPurchasedResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default charactersPurchasedRoute;

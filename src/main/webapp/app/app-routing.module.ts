import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
import LoginComponent from './login/login.component';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotifyComponent } from './pages/notify/notify.component';
import { DirectMessageComponent } from './pages/direct-message/direct-message/direct-message.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent,
          title: 'home.title',
        },
        {
          path: '',
          component: NavbarComponent,
          outlet: 'navbar',
        },

        {
          path: 'notification',
          component: NotifyComponent,
          title: '',
        },
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module'),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.route'),
        },
        {
          path: 'login',
          component: LoginComponent,
          title: 'Login',
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(({ EntityRoutingModule }) => EntityRoutingModule),
        },
        {
          path: '',
          loadChildren: () => import(`./pages/page-routing.module`).then(({ PageRoutingModule }) => PageRoutingModule),
        },
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED, bindToComponentInputs: true }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

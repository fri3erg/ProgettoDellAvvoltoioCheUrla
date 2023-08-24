import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountListComponent } from './followed-accounts/account-list.component';
import { UserPageComponent } from './user-page/user-page.component';
AccountListComponent
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'following', component: AccountListComponent },
  { path: 'following/:username', component: UserPageComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

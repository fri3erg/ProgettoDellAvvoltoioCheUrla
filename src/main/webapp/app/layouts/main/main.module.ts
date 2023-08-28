import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import MainComponent from './main.component';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import { CreateSquealComponent } from 'app/pages/squeal/create-squeal/create-squeal.component';

@NgModule({
  imports: [SharedModule, RouterModule, PageRibbonComponent, CreateSquealComponent],
  declarations: [MainComponent, FooterComponent],
})
export default class MainModule {}

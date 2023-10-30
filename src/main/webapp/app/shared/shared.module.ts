import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MessagesModule } from 'primeng/messages';
import FindLanguageFromKeyPipe from './language/find-language-from-key.pipe';
import TranslateDirective from './language/translate.directive';
import { AlertErrorComponent } from './alert/alert-error.component';
import { ChipsModule } from 'primeng/chips';
import { DataViewModule, DataViewLayoutOptions } from 'primeng/dataview';
import { SpeedDialModule } from 'primeng/speeddial';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AlertComponent } from './alert/alert.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
/**
 * Application wide Module
 */
@NgModule({
  imports: [
    AlertComponent,
    AlertErrorComponent,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    ChipsModule,
    DataViewModule,
    SpeedDialModule,
    AutoCompleteModule,
    ToastModule,
    ButtonModule,
    MessagesModule,
    ConfirmDialogModule,
    SelectButtonModule,
    ToggleButtonModule,
  ],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    AlertComponent,
    AlertErrorComponent,
    TranslateModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    ChipsModule,
    DataViewModule,
    DataViewLayoutOptions,
    SpeedDialModule,
    AutoCompleteModule,
    ToastModule,
    ButtonModule,
    MessagesModule,
    ConfirmDialogModule,
    SelectButtonModule,
    ToggleButtonModule,
  ],
})
export default class SharedModule {}

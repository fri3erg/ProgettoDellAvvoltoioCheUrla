import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { ConfirmationService, MessageService } from 'primeng/api';

const initialAccount: Account = {} as Account;

@Component({
  selector: 'jhi-settings',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export default class SettingsComponent implements OnInit {
  success = false;
  languages = LANGUAGES;

  settingsForm = new FormGroup({
    first_name: new FormControl(initialAccount.first_name, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    last_name: new FormControl(initialAccount.last_name, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    lang_key: new FormControl(initialAccount.lang_key, { nonNullable: true }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    image_url: new FormControl(initialAccount.image_url, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
    img: new FormControl(initialAccount.img, { nonNullable: true }),
    img_content_type: new FormControl(initialAccount.img_content_type, { nonNullable: true }),
  });

  constructor(
    private accountService: AccountService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });
  }

  save(): void {
    this.success = false;

    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(account);

      if (account.lang_key !== this.translateService.currentLang) {
        this.translateService.use(account.lang_key ?? 'en');
      }
    });
  }

  confirm(): void {
    this.confirmationService.confirm({
      message: 'Are you sure?,if you delete tour profile you will lose all data, also i will be sad :( ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.accountService.delete(initialAccount._id?.toString() ?? '').subscribe(() => this.accountService.authenticate(null));
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'deleted account' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: '' });
      },
    });
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MoneyService } from 'app/pages/money/money.service';
import { HttpResponse } from '@angular/common/http';
import { PaymentUrlResponse } from 'app/shared/model/deserialize-model';
import { finalize } from 'rxjs';

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
  response?: string;
  smm?: Account;
  results?: Account[];
  openmySearch = false;
  error: any;

  loading = false;
  paymentUrlResponse?: PaymentUrlResponse;
  @ViewChild('pf') paymentFormElement?: ElementRef;

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
    private messageService: MessageService,
    private moneyService: MoneyService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });
  }

  search(event: any): void {
    const q: string = event.query;
    console.log(q);

    this.accountService.findSMMSubbed(q).subscribe(r => {
      this.results = [];
      if (r.body) {
        for (const dest of r.body) {
          this.results.push(dest);
        }
      }
    });
  }

  removeSMM(): void {
    this.confirmationService.confirm({
      message: 'Are you sureyou want to remove this smm?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.accountService.removeSMM(this.smm?.login).subscribe(r => {
          if (r.body) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SMM removed' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SMM not removed' });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: '' });
      },
    });
  }

  makePayment(): void {
    this.loading = true;
    const pr = { desc: 'buying vip status' };
    this.moneyService
      .getPaymentUrl(pr)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        result => {
          if (result instanceof HttpResponse) {
            this.paymentUrlResponse = result.body;
            console.log(this.paymentUrlResponse);
            setTimeout(() => {
              this.submitPaymentForm();
            }, 500);
          } else {
            this.error = result;
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  submitPaymentForm(): void {
    console.log('submit');
    this.paymentFormElement?.nativeElement.submit();
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
        this.accountService.delete().subscribe(() => this.accountService.authenticate(null));
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'deleted account' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: '' });
      },
    });
  }
}

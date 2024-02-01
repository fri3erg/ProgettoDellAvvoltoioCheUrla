import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MoneyService } from './money.service';

@Component({
  selector: 'jhi-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss'],
})
export class MoneyComponent implements OnInit, OnDestroy {
  message = 'Attendere recupero di dati pagamento';
  loading = false;
  esitoPagamento?: string;
  classEsitoPagamento?: string;
  paymentResponse?: any; // Consider defining a more specific type or interface
  activeIndex?: number;
  private readonly destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router, private moneyService: MoneyService) {}

  ngOnInit(): void {
    this.initPage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initPage(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (!params.codiceEsito) {
        //this.router.navigate(['/']);
        //return;
      }

      this.loading = true;

      this.moneyService
        .payment({ params })
        .pipe(
          finalize(() => (this.loading = false)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          result => this.handlePaymentOutcome(result.body.data),
          error => console.log('scammer alert', error)
        );
    });
  }

  private handlePaymentOutcome(params: any): void {
    if (params.esito === 'OK') {
      this.classEsitoPagamento = 'fa fa-check-square green';
      this.esitoPagamento = `Pagamento approvato: ${String(params.messaggio)}`;
    } else {
      this.classEsitoPagamento = 'fa fa-times-circle red';
      this.esitoPagamento = `Transazione negata: ${String(params.messaggio)}`;
    }
  }
}

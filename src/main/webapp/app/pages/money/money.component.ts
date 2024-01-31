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
  message = 'Attendere recupero di dati pagamento e connessione a impianto per aggiornamenti dati';
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
      if (!params['codiceEsito']) {
        this.router.navigate(['findCard']);
        return;
      }

      this.handlePaymentOutcome(params);
      this.loading = true;

      this.moneyService
        .payment({ params })
        .pipe(
          finalize(() => (this.loading = false)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          result => this.handleServerResponse(result),
          error => this.handleError(error)
        );
    });
  }

  private handlePaymentOutcome(params: any): void {
    if (params['codiceEsito'] === '0') {
      this.classEsitoPagamento = 'fa fa-check-square green';
      this.esitoPagamento = `Pagamento approvato: ${params['messaggio']}`;
    } else {
      this.classEsitoPagamento = 'fa fa-times-circle red';
      this.esitoPagamento = `Transazione negata: ${params['messaggio']}`;
    }
  }

  private handleServerResponse(result: HttpResponse<any>): void {
    if (result instanceof HttpResponse) {
      this.paymentResponse = result.body;
      this.message = this.paymentResponse.message;
      // Assuming messageClass is used for CSS classes in your template
      this.classEsitoPagamento = this.paymentResponse.messageClass;

      if (this.paymentResponse.paymentSuccess) {
        this.esitoPagamento = 'Transazione approvato';
      } else {
        this.esitoPagamento = 'Transazione negata: ' + String(this.paymentResponse.message);
      }
    } else {
      this.message = 'Errore server aggiornamento stato pagamento e abbonamento';
    }
  }

  private handleError(error: any): void {
    console.error('Error processing payment: ', error);
    this.message = 'Si è verificato un errore nel processo di pagamento. Si prega di riprovare.';
    this.classEsitoPagamento = 'fa fa-times-circle red';
  }
}

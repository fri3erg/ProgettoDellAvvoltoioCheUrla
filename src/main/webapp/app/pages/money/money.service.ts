import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  payment(params: any): Observable<HttpResponse<any>> {
    const url = this.applicationConfigService.getEndpointFor('api/nexi-return');
    return this.http.post<any>(url, params, { observe: 'response' });
  }

  getPaymentUrl(params: any): Observable<HttpResponse<any>> {
    const url = this.applicationConfigService.getEndpointFor('api/nexi-start');
    return this.http.post<any>(url, params, { observe: 'response' });
  }
}

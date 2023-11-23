import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account } from 'app/core/auth/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;

  constructor(
    private translateService: TranslateService,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService
  ) {}

  setPhoto(user: Account): Observable<HttpResponse<Account>> {
    return this.http.post<Account>(this.applicationConfigService.getEndpointFor('api/account/img-update'), user, { observe: 'response' });
  }
  addSMM(id?: string): Observable<HttpResponse<Account>> {
    return this.http.post<Account>(this.applicationConfigService.getEndpointFor('api/account/add-smm'), id, { observe: 'response' });
  }
  update(user: Account): Observable<HttpResponse<Account>> {
    return this.http.post<Account>(this.applicationConfigService.getEndpointFor('api/account/update'), user, { observe: 'response' });
  }

  getUser(name: string): Observable<HttpResponse<Account>> {
    const url = this.applicationConfigService.getEndpointFor('api/user-by-name');
    const params = new HttpParams().append('name', name);
    return this.http.get<Account>(url, { params, observe: 'response' });
  }

  findSMM(search?: string): Observable<HttpResponse<Account[]>> {
    if (!search) {
      search = '';
    }
    const url = this.applicationConfigService.getEndpointFor(`api/smm/search`);
    const params = new HttpParams().append('search', search);
    return this.http.get<Account[]>(url, { params, observe: 'response' });
  }

  search(search: string): Observable<HttpResponse<Account[]>> {
    const url = this.applicationConfigService.getEndpointFor('api/users/search');
    const params = new HttpParams().append('search', search);
    return this.http.get<Account[]>(url, { params, observe: 'response' });
  }
  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account);

          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          // unless user have choosed other language in the current session
          if (!this.stateStorageService.getLocale()) {
            this.translateService.use(account.lang_key ?? account.lang_key ?? 'en');
          }

          this.navigateToStoredUrl();
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}

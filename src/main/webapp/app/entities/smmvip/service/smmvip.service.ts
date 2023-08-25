import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISMMVIP, NewSMMVIP } from '../smmvip.model';

export type PartialUpdateSMMVIP = Partial<ISMMVIP> & Pick<ISMMVIP, 'id'>;

export type EntityResponseType = HttpResponse<ISMMVIP>;
export type EntityArrayResponseType = HttpResponse<ISMMVIP[]>;

@Injectable({ providedIn: 'root' })
export class SMMVIPService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/smmvips');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sMMVIP: NewSMMVIP): Observable<EntityResponseType> {
    return this.http.post<ISMMVIP>(this.resourceUrl, sMMVIP, { observe: 'response' });
  }

  update(sMMVIP: ISMMVIP): Observable<EntityResponseType> {
    return this.http.put<ISMMVIP>(`${this.resourceUrl}/${this.getSMMVIPIdentifier(sMMVIP)}`, sMMVIP, { observe: 'response' });
  }

  partialUpdate(sMMVIP: PartialUpdateSMMVIP): Observable<EntityResponseType> {
    return this.http.patch<ISMMVIP>(`${this.resourceUrl}/${this.getSMMVIPIdentifier(sMMVIP)}`, sMMVIP, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ISMMVIP>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISMMVIP[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSMMVIPIdentifier(sMMVIP: Pick<ISMMVIP, 'id'>): string {
    return sMMVIP.id;
  }

  compareSMMVIP(o1: Pick<ISMMVIP, 'id'> | null, o2: Pick<ISMMVIP, 'id'> | null): boolean {
    return o1 && o2 ? this.getSMMVIPIdentifier(o1) === this.getSMMVIPIdentifier(o2) : o1 === o2;
  }

  addSMMVIPToCollectionIfMissing<Type extends Pick<ISMMVIP, 'id'>>(
    sMMVIPCollection: Type[],
    ...sMMVIPSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sMMVIPS: Type[] = sMMVIPSToCheck.filter(isPresent);
    if (sMMVIPS.length > 0) {
      const sMMVIPCollectionIdentifiers = sMMVIPCollection.map(sMMVIPItem => this.getSMMVIPIdentifier(sMMVIPItem)!);
      const sMMVIPSToAdd = sMMVIPS.filter(sMMVIPItem => {
        const sMMVIPIdentifier = this.getSMMVIPIdentifier(sMMVIPItem);
        if (sMMVIPCollectionIdentifiers.includes(sMMVIPIdentifier)) {
          return false;
        }
        sMMVIPCollectionIdentifiers.push(sMMVIPIdentifier);
        return true;
      });
      return [...sMMVIPSToAdd, ...sMMVIPCollection];
    }
    return sMMVIPCollection;
  }
}

import { Injectable, HostListener } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { filter, take, takeWhile } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  private screenWidthSource = new ReplaySubject<number>(1);

  get screenWidth$(): Observable<number> {
    return this.screenWidthSource.asObservable();
  }

  setScreenWidth(screenWidth: number): void {
    this.screenWidthSource.next(screenWidth);
  }


}

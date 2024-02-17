import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { NotificationService } from 'app/pages/notify/notification.service';
import { SocketService } from 'app/socket.service';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export default class FooterComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  unreadNotificationCount = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private accountService: AccountService,
    private socketService: SocketService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(a => {
          this.account = a;
          return this.notificationService.getNotReadCount(this.account?.login ?? '');
        }),
        switchMap(r => {
          if (r.body) {
            this.unreadNotificationCount = r.body;
          }
          return this.socketService.getNotificationObservable();
        })
      )
      .subscribe((notification: any) => {
        console.log('Received notification from the socket:', notification);
        this.ref.detectChanges();
        this.generateBeep();
        this.notificationService.getNotReadCount(this.account?.login ?? '').subscribe(p => {
          if (p.body) {
            this.unreadNotificationCount = p.body;
            console.log('Unread notification count:', this.unreadNotificationCount);
          }
        });
      });
  }

  recalc(): void {
    console.log('recalc');
    this.unreadNotificationCount = 0;
    this.router.navigate(['/notification']);
  }

  generateBeep(): void {
    const audio = new Audio('/home/assets/sounds/ding.mp3');
    audio.play();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { NotificationService } from 'app/pages/notify/notification.service';
import { SocketService } from 'app/socket.service';
import { Subject, takeUntil } from 'rxjs';

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
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(a => {
        this.account = a;
        this.notificationService.getNotReadCount(this.account?.login ?? '').subscribe(r => {
          if (r.body) {
            this.unreadNotificationCount = r.body;

            this.socketService.getNotificationObservable().subscribe((notification: Notification) => {
              console.log('Received notification from the socket:', notification);
              this.notificationService.getNotReadCount(this.account?.login ?? '').subscribe(p => {
                if (p.body) {
                  this.unreadNotificationCount = p.body;
                }
              });
            });
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { Subject, takeUntil } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import SharedModule from 'app/shared/shared.module';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';

@Component({
  selector: 'jhi-notify',
  standalone: true,
  imports: [CommonModule, SharedModule, ObserveElementDirective],
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  notifications: Notification[] = [];
  page = 0;
  size = 15;
  isLoad = false;
  hasMorePage = true;
  private readonly destroy$ = new Subject<void>();
  constructor(private notificationService: NotificationService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(a => {
        this.account = a;
      });
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.account?.login ?? '', this.page, this.size).subscribe(r => {
      if (r.body) {
        console.log(r.body);
        this.notifications = r.body;
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
      }
    });
  }
  setRead(): void {
    const ids = [];
    for (const notification of this.notifications) {
      ids.push(notification._id);
    }
    this.notificationService.setRead(ids).subscribe(r => {
      if (r.body) {
        console.log(r.body);
      }
    });
  }
  loadUnreadNotifications(): void {
    this.notificationService.getNotificationsUnRead(this.account?.login ?? '').subscribe(r => {
      if (r.body) {
        console.log(r.body);
        this.notifications = r.body;
      }
    });
  }

  isIntersecting(event: boolean): void {
    console.log(`Element is intersecting`);
    console.log(event);
    if (!event) {
      this.isLoad = true;
    } else if (this.isLoad && this.hasMorePage) {
      console.log('load more');
      this.loadNotifications();
      this.isLoad = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

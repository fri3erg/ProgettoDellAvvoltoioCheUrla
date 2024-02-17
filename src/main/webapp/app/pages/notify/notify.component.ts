import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import SharedModule from 'app/shared/shared.module';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-notify',
  standalone: true,
  imports: [CommonModule, SharedModule, ObserveElementDirective],
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];

  account: Account | null = null;
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
      .subscribe(account => {
        this.account = account;
        console.log(account);
      });
    this.loadNotifications();
    this.setRead();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.page, this.size).subscribe(r => {
      if (r.body) {
        console.log(r.body);
        this.notifications = this.notifications.concat(r.body);
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
      }
    });
  }
  timeDifference(previous: any): string {
    const current = Date.now();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000).toString() + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute).toString() + ' minutes ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour).toString() + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay).toString() + ' days ago';
    } else if (elapsed < msPerYear) {
      return 'about ' + Math.round(elapsed / msPerMonth).toString() + ' months ago';
    } else {
      return 'about ' + Math.round(elapsed / msPerYear).toString() + ' years ago';
    }
  }

  setDefaultImage(event: any): void {
    event.target.src = 'content/images/default-img.jpg'; // Replace this with your default image path
  }

  createLink(notification: any): string {
    let user_name = notification.username;
    if (notification.username?.startsWith('@')) {
      user_name = notification.username.substring(1);
    }
    if (notification.type === 'MESSAGE') {
      return `/direct-message/user/${String(user_name)}`;
    }
    if (notification.type === 'COMMENT' || notification.type === 'SMM') {
      return `/profile/${String(user_name)}`;
    }
    if (notification.type === 'REACTION') {
      return `/profile`;
    }
    return './';
  }
  setRead(): void {
    const ids = [];
    for (const notification of this.notifications) {
      ids.push(notification._id);
    }
    this.notificationService.setAllRead(ids).subscribe(r => {
      console.log(r.body);
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
      this.setRead();
      this.isLoad = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

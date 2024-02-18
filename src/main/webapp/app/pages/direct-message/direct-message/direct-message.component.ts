import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import SharedModule from 'app/shared/shared.module';
import { Account } from 'app/core/auth/account.model';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { CommonModule } from '@angular/common';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { NotificationService } from 'app/pages/notify/notification.service';
import { SocketService } from 'app/socket.service';
import { Notification } from 'app/pages/notify/notification.model';

@Component({
  selector: 'jhi-direct-message',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './direct-message.component.html',
  styleUrls: ['./direct-message.component.scss'],
})
export class DirectMessageComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  notifyMap = new Map<ISquealDTO, number>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private squealService: SquealService,
    private accountService: AccountService,
    protected channelService: ChannelService,
    protected channelUserService: ChannelUserService,
    protected notificationService: NotificationService,
    private socketService: SocketService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        console.log(account);
      });
    this.getPreview();

    this.socketService.getNotificationObservable().subscribe((notification: Notification) => {
      console.log('Received notification from the socket:', notification);
      this.ref.detectChanges();
      if (notification.type === 'MESSAGE') {
        this.getPreview();
      }
    });
  }

  setDefaultImage(event: any): void {
    event.target.src = 'content/images/default-img.jpg'; // Replace this with your default image path
  }
  getPreview(): void {
    this.squealService.getDirectSquealPreview().subscribe(r => {
      if (r.body) {
        const squeals = r.body;
        console.log(squeals);
        for (const squeal of squeals) {
          this.notifyMap.set(squeal, 0);
          console.log(squeal.userName);
          if (squeal.userName) {
            this.notificationService.getNotifCount(squeal.userName).subscribe(a => {
              if (a.body) {
                this.notifyMap.set(squeal, a.body);
              }
            });
          }
        }
      }
    });
  }
  getSqueals(): ISquealDTO[] {
    console.log(Array.from(this.notifyMap.keys()));
    return Array.from(this.notifyMap.keys());
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { ChangeDetectorRef, Component, OnInit, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { Account } from 'app/core/auth/account.model';
import { Observable, Subject } from 'rxjs';
import { IUserCharsDTO } from 'app/entities/user-chars/user-chars.model';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import SharedModule from 'app/shared/shared.module';
import { UserCharsService } from 'app/entities/user-chars/service/user-chars.service';
import { FormsModule } from '@angular/forms';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';
import { NotificationService } from 'app/pages/notify/notification.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SocketService } from 'app/socket.service';
import { Notification } from 'app/pages/notify/notification.model';

@Component({
  selector: 'jhi-personal-messages',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ObserveElementDirective],
  templateUrl: './personal-messages.component.html',
  styleUrls: ['./personal-messages.component.scss'],
})
export class PersonalMessagesComponent implements OnInit {
  username?: string | null;
  squeals?: ISquealDTO[];
  account: Account | null = null;
  page = 0;
  size = 15;
  isLoad = false;
  hasMorePage = false;
  message = '';
  dto?: ISquealDTO;
  charsDTO?: IUserCharsDTO;
  destinationMessage: ISquealDestination = {
    destination_type: ChannelTypes.MESSAGE,
  };

  constructor(
    protected userCharsService: UserCharsService,
    protected squealService: SquealService,
    protected channelService: ChannelService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private accountService: AccountService,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.dto = {
      squeal: {},
    };
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    if (this.username) {
      this.destinationMessage.destination = '@' + this.username;
      console.log(this.destinationMessage);
      this.loadSqueals();
      this.accountService.getUser(this.username).subscribe(r => {
        if (r.body) {
          this.account = r.body;
        }
      });
      this.userCharsService.getChars().subscribe(r => {
        if (r.body) {
          this.charsDTO = r.body;
        }
      });
    }
    this.socketService.getNotificationObservable().subscribe((data: any) => {
      const notification: Notification = data.message; // Qui assumiamo che i dati siano annidati dentro 'message'
      console.log('Received notification from the socket:', notification);
      this.ref.detectChanges();
      if (notification.type === 'MESSAGE') {
        console.log('Received notification from the socket: 3', notification);
        this.page = 0;
        this.loadSqueals();
      }
    });
  }

  loadSqueals(): void {
    if (this.username) {
      this.squealService.getSquealByUser(this.username, this.page, this.size).subscribe(r => {
        if (r.body) {
          this.hasMorePage = r.body.length >= this.size;
          this.page++;
          this.squeals = r.body;
          this.squeals.sort((a, b) => (a.squeal?.timestamp ?? 0) - (b.squeal?.timestamp ?? 0));
          console.log(this.squeals);
          this.notificationService.setReadDirect(this.username ?? '').subscribe(a => {
            console.log(a);
          });
        }
      });
    }
  }

  sanitize(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.urlify(text));
  }

  urlify(text: string): string {
    const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/g;
    return text.replace(urlRegex, url => '<a href="' + url + '">' + url + '</a>');
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

  appendSqueals(): void {
    if (this.username) {
      console.log('load');
      this.squealService.getSquealByUser(this.username, this.page, 5).subscribe(r => {
        if (r.body) {
          this.hasMorePage = r.body.length >= this.size;
          this.page++;
          if (this.squeals) {
            this.squeals = [...this.squeals.concat(r.body)];

            this.squeals.sort((a, b) => (a.squeal?.timestamp ?? 0) - (b.squeal?.timestamp ?? 0));
          }
        }
      });
    }
  }

  getRemainingChars(): number {
    return (this.charsDTO?.remainingChars ?? 0) - this.message.length;
  }

  createSqueal(): void {
    if (!this.dto?.squeal) {
      return;
    }
    this.dto.squeal.body = this.message;
    const dest: ISquealDestination[] = [];
    dest.push(this.destinationMessage);
    this.dto.squeal.destination = dest;
    console.log(this.dto);
    this.squealService.insertOrUpdate(this.dto).subscribe(r => {
      if (r.body) {
        this.dto = r.body;
        console.log(this.dto);
        this.squeals?.push(this.dto);
        this.message = '';
        this.dto = { squeal: {} };
      }
    });
  }
  isIntersecting(event: boolean): void {
    console.log(`Element is intersecting`);
    console.log(event);
    if (!event) {
      this.isLoad = true;
    } else if (this.isLoad && this.hasMorePage) {
      this.appendSqueals();
      this.isLoad = false;
    }
  }
}

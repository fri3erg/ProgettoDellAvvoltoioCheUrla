import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { Account } from 'app/core/auth/account.model';
import { Subject } from 'rxjs';
import { IUserCharsDTO } from 'app/entities/user-chars/user-chars.model';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import SharedModule from 'app/shared/shared.module';
import { UserCharsService } from 'app/entities/user-chars/service/user-chars.service';
import { FormsModule } from '@angular/forms';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';
import { NotificationService } from 'app/pages/notify/notification.service';

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
  size = 5;
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
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.dto = {
      squeal: {},
    };
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    if (this.username) {
      this.destinationMessage.destination = '@' + this.username;
      console.log(this.destinationMessage);
      this.squealService.getSquealByUser(this.username, this.page, this.size).subscribe(r => {
        if (r.body) {
          this.hasMorePage = r.body.length >= this.size;
          this.page++;
          this.squeals = r.body;
          console.log(this.squeals);
          this.notificationService.setReadDirect(this.username ?? '').subscribe(a => {
            console.log(a);
          });
        }
      });
    }
    this.userCharsService.getChars().subscribe(r => {
      if (r.body) {
        this.charsDTO = r.body;
      }
    });
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
    this.dto.squeal.body = this.message;
    dest.push(this.destinationMessage);
    this.dto.squeal.destination = dest;
    console.log(this.dto.squeal.destination);
    console.log('insert');
    console.log(this.dto);
    this.squealService.insertOrUpdate(this.dto).subscribe(r => {
      if (r.body) {
        this.squeals?.push(r.body);
        this.dto = r.body;
        this.message = this.dto.squeal?.body ?? '';
        console.log(this.dto);
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

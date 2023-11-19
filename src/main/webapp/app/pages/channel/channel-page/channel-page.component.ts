import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';
import { CreateSquealComponent } from 'app/pages/squeal/create-squeal/create-squeal.component';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { Account } from 'app/core/auth/account.model';
import { Subject, takeUntil } from 'rxjs';
import SharedModule from 'app/shared/shared.module';
import { SquealViewComponent } from 'app/pages/squeal/squeal-view/squeal-view.component';
import { ChannelSubscribeComponent } from '../channel-subscribe/channel-subscribe.component';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';

@Component({
  selector: 'jhi-channel-page',
  standalone: true,
  imports: [CommonModule, ObserveElementDirective, CreateSquealComponent, SharedModule, SquealViewComponent, ChannelSubscribeComponent],
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss'],
})
export class ChannelPageComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  channel?: IChannelDTO;
  channel_id?: string;
  squeals: ISquealDTO[] = [];
  page = 0;
  size = 5;
  hasMorePage = false;
  isLoad = false;
  usersFollowing = 0;
  squealsSquealed = 0;
  connectedDestination?: ISquealDestination;
  private readonly destroy$ = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected squealService: SquealService,
    protected channelService: ChannelService,
    private accountService: AccountService,
    protected channelUserService: ChannelUserService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        console.log(account);
      });

    this.activatedRoute.params.subscribe(params => {
      this.channel_id = params['id'];
      this.page = 0;
      this.size = 5;
      this.loadChannel();
      this.loadSqueals();
    });
  }

  loadChannel(): void {
    console.log('load');
    this.channelService.findDTO(this.channel_id ?? '').subscribe(r => {
      if (r.body) {
        this.channel = r.body;
        console.log(r.body);
        this.loadOther(this.channel);
      }
    });
  }

  loadSqueals(): void {
    this.squealService.getSquealByChannel(this.channel_id ?? '', this.page, this.size).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = r.body;
      }
    });
  }

  loadOther(channel: IChannelDTO): void {
    this.usersFollowing = channel.users.length;
    this.connectedDestination = {
      destination: channel.channel.name?.substring(1),
      destination_id: channel.channel._id,
      destination_type: channel.channel.type,
    };
  }

  appendSqueals(): void {
    console.log('load');
    this.squealService.getSquealByChannel(this.channel?.channel._id ?? '', this.page, 5).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = [...this.squeals.concat(r.body)];
      }
    });
  }

  createdSqueal(): void {
    this.page = 0;
    this.squeals = [];
    this.loadSqueals();
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
  isLogged(): boolean {
    return this.accountService.isAuthenticated();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

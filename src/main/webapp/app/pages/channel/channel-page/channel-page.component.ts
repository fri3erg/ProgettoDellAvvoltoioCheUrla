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
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-channel-page',
  standalone: true,
  imports: [
    CommonModule,
    ObserveElementDirective,
    FormsModule,
    CreateSquealComponent,
    SharedModule,
    SquealViewComponent,
    ChannelSubscribeComponent,
  ],
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
  openmySearch = false;
  guy?: Account[];
  results: Account[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected squealService: SquealService,
    protected channelService: ChannelService,
    private accountService: AccountService,
    protected channelUserService: ChannelUserService,
    private messageService: MessageService
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
    this.channelService.findDTO(this.channel_id ?? '').subscribe(r => {
      if (r.body) {
        this.channel = r.body;
        console.log(r.body);
        this.loadOther();
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

  loadOther(): void {
    console.log(this.channel);
    this.usersFollowing = this.channel?.users.length ?? 0;
    this.connectedDestination = {
      destination: this.channel?.channel.name,
      destination_id: this.channel?.channel._id,
      destination_type: this.channel?.channel.type,
    };
  }

  appendSqueals(): void {
    this.squealService.getSquealByChannel(this.channel?.channel._id ?? '', this.page, 5).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = [...this.squeals.concat(r.body)];
      }
    });
  }
  isUserSubscribed(): boolean {
    console.log(this.channel?.users);
    if (!this.channel?.users) {
      return false;
    }
    const u = this.channel.users.find(ch => ch.user_id === this.account?._id);
    return !!u;
  }

  createdSqueal(): void {
    this.page = 0;
    this.squeals = [];
    this.loadSqueals();
  }
  addPeople(): void {
    const ids = [];
    if (!this.guy) {
      return;
    }
    for (const guy of this.guy) {
      if (guy._id) {
        ids.push(guy._id.toString());
      }
    }
    this.channelService.addPeople(ids, this.channel?.channel._id?.toString() ?? '').subscribe(r => {
      if (r.body) {
        if (r.body.length === ids.length) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'guy added' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'not all guy added' });
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'guy not added' });
      }
    });
  }

  search(event: any): void {
    const q: string = event.query;

    this.accountService.search(q).subscribe(r => {
      this.results = [];
      if (r.body) {
        for (const dest of r.body) {
          this.results.push(dest);
        }
      }
    });
  }
  isPrivate(): boolean {
    return this.channel?.channel.type === 'PRIVATEGROUP';
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';
import { CreateSquealComponent } from 'app/pages/squeal/create-squeal/create-squeal.component';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { Account } from 'app/core/auth/account.model';
import { NewChannelUser } from 'app/entities/channel-user/channel-user.model';
import { Subject, takeUntil } from 'rxjs';
import SharedModule from 'app/shared/shared.module';
import { SquealViewComponent } from 'app/pages/squeal/squeal-view/squeal-view.component';

@Component({
  selector: 'jhi-channel-page',
  standalone: true,
  imports: [CommonModule, ObserveElementDirective, CreateSquealComponent, SharedModule, SquealViewComponent],
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss'],
})
export class ChannelPageComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  channel?: IChannelDTO;
  channelId?: string;
  squeals: ISquealDTO[] = [];
  page = 0;
  size = 5;
  hasMorePage = false;
  isLoad = false;
  usersFollowing = 0;
  squealsSquealed = 0;
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

    this.channelId = this.activatedRoute.snapshot.paramMap.get('id')?.toString();
    if (this.channelId) {
      this.loadSqueals();
      this.usersFollowing = this.channel?.users.length ?? 0;
    }
    this.channelService.countUsersFollowing(this.channelId ?? '').subscribe(r => {
      if (r.body) {
        this.usersFollowing = r.body;
      }
    });
  }
  loadSqueals(): void {
    console.log('load');
    this.channelService.findDTO(this.channelId ?? '').subscribe(r => {
      if (r.body) {
        this.channel = r.body;
      }
    });

    this.squealService.getSquealByChannel(this.channelId ?? '', this.page, this.size).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = r.body;
      }
    });
  }

  appendSqueals(): void {
    console.log('load');
    this.squealService.getSquealByChannel(this.channelId ?? '', this.page, 5).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = [...this.squeals.concat(r.body)];
      }
    });
  }

  createdSqueal(): void {
    this.loadSqueals();
  }

  sub(c?: IChannelDTO): void {
    if (c) {
      //TO DO check security

      const nu: NewChannelUser = {
        id: null,
        userId: this.account?.id,
        channelId: c.channel.id,
        privilege: PrivilegeType.READ,
      };
      this.channelUserService.create(nu).subscribe(r => {
        if (r.body) {
          c.users.push(r.body);
          console.log(c);
        }
      });
    }
  }
  unSub(c?: IChannelDTO): void {
    if (c) {
      const u = c.users.find(ch => ch.userId === this.account?.id);
      if (!u) {
        return;
      }
      this.channelUserService.delete(u.id).subscribe(() => {
        c.users = c.users.filter(obj => obj.id !== u.id);
      });
    }
  }

  isUserSubscribed(c?: IChannelDTO): boolean {
    if (c) {
      const u = c.users.find(ch => ch.userId === this.account?.id);
      return !!u;
    } else {
      return false;
    }
  }
  returnColor(c?: IChannelDTO): string {
    if (c) {
      switch (c.channel.type) {
        case ChannelTypes.PRIVATEGROUP:
          return 'text-bg-info';
          break;
        case ChannelTypes.PUBLICGROUP:
          return 'text-bg-success';
          break;
        case ChannelTypes.MOD:
          return 'text-bg-warning';
      }
    }
    return '';
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import SharedModule from 'app/shared/shared.module';
import { Account } from 'app/core/auth/account.model';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { NewChannelUser } from 'app/entities/channel-user/channel-user.model';
import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';

@Component({
  selector: 'jhi-channel-list',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  searchKey = '';
  createName = ' ';
  toggle = true;

  channels: IChannelDTO[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    protected channelService: ChannelService,
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
  }

  search(): void {
    this.channelService.search(this.searchKey).subscribe(r => {
      if (r.body) {
        this.channels = r.body;
      }
    });
  }

  sub(c: IChannelDTO): void {
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
  unSub(c: IChannelDTO): void {
    const u = c.users.find(ch => ch.userId === this.account?.id);
    if (!u) {
      return;
    }
    this.channelUserService.delete(u.id).subscribe(() => {
      c.users = c.users.filter(obj => obj.id !== u.id);
    });
  }

  isUserSubscribed(c: IChannelDTO): boolean {
    const u = c.users.find(ch => ch.userId === this.account?.id);
    return !!u;
  }

  returnColor(c: IChannelDTO): string {
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
    return '';
  }

  createChannel(): void {
    // TODO create
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

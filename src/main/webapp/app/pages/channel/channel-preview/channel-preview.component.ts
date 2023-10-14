import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { NewChannelUser } from 'app/entities/channel-user/channel-user.model';
import { Account } from 'app/core/auth/account.model';
import { Subject, takeUntil } from 'rxjs';
import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-channel-preview',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './channel-preview.component.html',
  styleUrls: ['./channel-preview.component.scss'],
})
export class ChannelPreviewComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  @Input({ required: true }) channel?: IChannelDTO;
  private readonly destroy$ = new Subject<void>();

  constructor(
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
  }

  sub(c?: IChannelDTO): void {
    if (c == null) {
      return;
    }

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
  unSub(c?: IChannelDTO): void {
    if (c == null) {
      return;
    }
    const u = c.users.find(ch => ch.userId === this.account?.id);
    if (!u) {
      return;
    }
    this.channelUserService.delete(u.id).subscribe(() => {
      c.users = c.users.filter(obj => obj.id !== u.id);
    });
  }

  isUserSubscribed(c?: IChannelDTO): boolean {
    const u = c?.users.find(ch => ch.userId === this.account?.id);
    return !!u;
  }

  returnColor(c?: IChannelDTO): string {
    switch (c?.channel.type) {
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

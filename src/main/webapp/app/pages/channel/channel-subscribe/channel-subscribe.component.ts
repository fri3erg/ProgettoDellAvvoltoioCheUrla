import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { NewChannelUser } from 'app/entities/channel-user/channel-user.model';
import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { Subject, takeUntil } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import SharedModule from 'app/shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-channel-subscribe',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './channel-subscribe.component.html',
  styleUrls: ['./channel-subscribe.component.scss'],
})
export class ChannelSubscribeComponent implements OnInit, OnDestroy {
  @Input({ required: true }) channel?: IChannelDTO;
  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    protected channelService: ChannelService,
    private accountService: AccountService,
    protected channelUserService: ChannelUserService,
    private confirmationService: ConfirmationService,
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sub(c?: IChannelDTO): void {
    if (c == null) {
      return;
    }

    //TO DO check security

    const nu: NewChannelUser = {
      id: null,
      user_id: this.account?.id,
      channel_id: c.channel._id,
      privilege: PrivilegeType.READ,
    };
    this.channelUserService.create(nu).subscribe(r => {
      if (r.body) {
        c.users.push(r.body);
        console.log(c);
      }
    });
  }

  confirm(c?: IChannelDTO): void {
    /*if(c?.channel.type!==ChannelTypes.PRIVATEGROUP){
    this.unSub(c);
    return;
  }*/
    this.confirmationService.confirm({
      message: 'careful, you will not be able to resubscribe',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'unsubscribed' });
        this.unSub(c);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'cancelled' });
      },
    });
  }

  unSub(c?: IChannelDTO): void {
    if (c == null) {
      return;
    }
    const u = c.users.find(ch => ch.user_id === this.account?.id);
    if (!u) {
      return;
    }
    this.channelUserService.delete(u.id).subscribe(() => {
      c.users = c.users.filter(obj => obj.id !== u.id);
    });
  }

  isUserSubscribed(c?: IChannelDTO): boolean {
    const u = c?.users.find(ch => ch.user_id === this.account?.id);
    return !!u;
  }

  returnColor(c?: IChannelDTO): string {
    switch (c?.channel.type) {
      case 'PRIVATEGROUP':
        return 'text-bg-info';
        break;
      case 'PUBLICGROUP':
        return 'text-bg-success';
        break;
      case 'MOD':
        return 'text-bg-warning';
      default:
        return '';
    }
    return '';
  }
}

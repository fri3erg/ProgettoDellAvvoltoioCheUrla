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
import { CommonModule } from '@angular/common';
import { IDirectDTO, ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';

@Component({
  selector: 'jhi-direct-message',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './direct-message.component.html',
  styleUrls: ['./direct-message.component.scss'],
})
export class DirectMessageComponent implements OnInit, OnDestroy {
  squeals: ISquealDTO[] = [];
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private squealService: SquealService,
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

    this.squealService.getDirectSqueal().subscribe(r => {
      if (r.body) {
        this.squeals = r.body;
        console.log(this.squeals);
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

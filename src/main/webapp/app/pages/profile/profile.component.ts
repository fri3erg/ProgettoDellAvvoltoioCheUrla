import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { Subject, takeUntil } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { CreateSquealComponent } from '../squeal/create-squeal/create-squeal.component';
import { SquealViewComponent } from '../squeal/squeal-view/squeal-view.component';
import SharedModule from 'app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-profile',
  standalone: true,
  imports: [SharedModule, CommonModule, CreateSquealComponent, SquealViewComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  nChannels = 0;
  squeals?: ISquealDTO[];
  profileName?: string;
  private readonly destroy$ = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected channelService: ChannelService,
    private accountService: AccountService,
    protected channelUserService: ChannelUserService,
    protected squealService: SquealService
  ) {}

  ngOnInit(): void {
    this.profileName = this.activatedRoute.snapshot.paramMap.get('name')?.toString();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        console.log(account);
        if (!this.profileName) {
          this.profileName = account?.login;
          console.log(this.profileName);
        }
      });
    this.squealService.getSquealMadeByUser(this.profileName ?? '').subscribe(r => {
      if (r.body) {
        this.squeals = r.body;
        console.log('users squeals:');
        console.log(this.squeals);
      }
    });
    this.channelService.countChannelsUserIsSubbed(this.profileName ?? '').subscribe(r => {
      if (r.body) {
        this.nChannels = r.body;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

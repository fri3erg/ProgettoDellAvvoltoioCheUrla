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

@Component({
  selector: 'jhi-profile',
  standalone: true,
  imports: [CommonModule, CreateSquealComponent, SquealViewComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  //channels: IChannelDTO[] = [];
  nChannels = 0;
  squeals: ISquealDTO[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    protected channelService: ChannelService,
    private accountService: AccountService,
    protected channelUserService: ChannelUserService,
    protected squealService: SquealService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        console.log(account);
      });
    /*this.channelService.getSubscribed().subscribe(r => {
        if(r.body){
          this.channels=r.body;
        }
      });*/
    this.squealService.getSquealMadeByUser().subscribe(r => {
      if (r.body) {
        this.squeals = r.body;
      }
    });
    this.channelService.countChannelSubscribed().subscribe(r => {
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

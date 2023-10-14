import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import SharedModule from 'app/shared/shared.module';
import { Account } from 'app/core/auth/account.model';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ChannelPreviewComponent } from '../channel-preview/channel-preview.component';

@Component({
  selector: 'jhi-channel-list',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule, ChannelPreviewComponent],
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

  constructor(private accountService: AccountService, private channelService: ChannelService) {}

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

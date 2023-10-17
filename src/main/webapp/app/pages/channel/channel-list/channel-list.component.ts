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
import { UserPreviewComponent } from '../user-preview/user-preview.component';

@Component({
  selector: 'jhi-channel-list',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule, ChannelPreviewComponent, UserPreviewComponent],
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  searchKey = '';
  createName = ' ';
  toggle = true;

  channels: IChannelDTO[] = [];
  users: Account[] = [];

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
    if (this.searchKey.length >= 2) {
      this.channelService.search(this.searchKey).subscribe(r => {
        if (r.body) {
          this.channels = r.body;
          console.log(this.channels);
        }
      });
      this.accountService.search(this.searchKey).subscribe(r => {
        if (r.body) {
          this.users = r.body;
          console.log(this.users);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

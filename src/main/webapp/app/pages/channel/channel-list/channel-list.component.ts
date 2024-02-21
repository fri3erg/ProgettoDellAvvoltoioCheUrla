import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
export class ChannelListComponent implements OnInit, OnDestroy, AfterViewInit {
  account: Account | null = null;
  searchKey = '';
  createName = ' ';
  size = 5;
  toggle = true;
  first = true;

  combinedAndShuffledResults?: any[];
  @ViewChild('searchtext') searchInputElement?: ElementRef;
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
    forkJoin({
      channels: this.channelService.getRandomChannels(this.size),
      users: this.accountService.getRandomUsers(this.size),
    })
      .pipe(
        map(results => {
          const channels = results.channels.body ? results.channels.body.map(ch => ({ ...ch, destype: 'channel' })) : [];
          const users = results.users.body ? results.users.body.map(us => ({ ...us, destype: 'user' })) : [];

          // Combine and shuffle the arrays
          const combined = [...channels, ...users];
          this.shuffleArray(combined);

          return combined;
        })
      )
      .subscribe(shuffledResults => {
        this.combinedAndShuffledResults = shuffledResults;
        console.log(shuffledResults);
      });
  }

  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
  }

  ngAfterViewInit(): void {
    this.searchInputElement?.nativeElement.focus();
  }

  search(): void {
    this.combinedAndShuffledResults = [];
    if (this.searchKey.length >= 2) {
      forkJoin({
        channels: this.channelService.search(this.searchKey),
        users: this.accountService.search(this.searchKey),
      })
        .pipe(
          map(results => {
            const channels = results.channels.body ? results.channels.body.map(ch => ({ ...ch, destype: 'channel' })) : [];
            const users = results.users.body ? results.users.body.map(us => ({ ...us, destype: 'user' })) : [];

            // Combine and shuffle the arrays
            const combined = [...channels, ...users];
            this.shuffleArray(combined);

            return combined;
          })
        )
        .subscribe(shuffledResults => {
          this.combinedAndShuffledResults = shuffledResults;
          console.log(shuffledResults);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';
import { MessageService, SelectItem } from 'primeng/api';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import { IChannel } from 'app/entities/channel/channel.model';
import { Account } from 'app/core/auth/account.model';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-channel-edit',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.scss'],
})
export class ChannelEditComponent implements OnInit, OnDestroy {
  dto: IChannelDTO = {
    channel: { name: '', description: '' },
    users: [],
  };

  account: Account | null = null;
  messages = {};
  private = 'true';

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected channelService: ChannelService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        console.log(account);
      });
    this.activatedRoute.data.subscribe(({ channel }) => {
      this.dto = channel;
    });
  }
  addSingle(): void {
    this.messageService.add({ severity: 'error', summary: 'Invalid Format', detail: '' });
  }

  isIncorrect(): boolean {
    const q: string = this.dto.channel.name ?? '';
    return q.includes('§') || q.includes('#') || q.includes('@') || q.includes(' ') || q === '' || q.toLowerCase() !== q;
  }

  createChannel(): void {
    if (this.isIncorrect()) {
      this.addSingle();
      return;
    }
    this.dto.channel.type = this.addType();
    this.channelService.insertOrUpdate(this.dto).subscribe(r => {
      if (r.body) {
        this.dto.channel.name = '';
        this.messageService.add({ severity: 'success', summary: 'Channel Created', detail: '' });
      }
    });
  }
  addType(): ChannelTypes {
    if (this.private) {
      return ChannelTypes.PRIVATEGROUP;
    }
    return ChannelTypes.PUBLICGROUP;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

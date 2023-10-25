import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import SharedModule from 'app/shared/shared.module';
import { UserPreviewComponent } from 'app/pages/channel/user-preview/user-preview.component';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-users-of-channel',
  standalone: true,
  imports: [CommonModule, SharedModule, UserPreviewComponent],
  templateUrl: './users-of-channel.component.html',
  styleUrls: ['./users-of-channel.component.scss'],
})
export class UsersOfChannelComponent implements OnInit {
  channel_id?: string;
  users: Account[] = [];
  constructor(protected channelService: ChannelService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.channel_id = this.activatedRoute.snapshot.paramMap.get('id')?.toString();
    this.channelService.getUsersSubbedToChannel(this.channel_id ?? '').subscribe(r => {
      if (r.body) {
        console.log(r.body);
        this.users = r.body;
      }
    });
  }
}

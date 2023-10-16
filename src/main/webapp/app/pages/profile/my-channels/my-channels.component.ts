import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import SharedModule from 'app/shared/shared.module';
import { ChannelPreviewComponent } from 'app/pages/channel/channel-preview/channel-preview.component';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-my-channels',
  standalone: true,
  imports: [CommonModule, SharedModule, ChannelPreviewComponent],
  templateUrl: './my-channels.component.html',
  styleUrls: ['./my-channels.component.scss'],
})
export class MyChannelsComponent implements OnInit {
  channels: IChannelDTO[] = [];
  profileId?: string;
  constructor(protected channelService: ChannelService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.profileId = this.activatedRoute.snapshot.paramMap.get('id')?.toString();
    this.channelService.getSubscribed(this.profileId ?? '').subscribe(r => {
      if (r.body) {
        console.log(r.body);
        this.channels = r.body;
      }
    });
  }
}

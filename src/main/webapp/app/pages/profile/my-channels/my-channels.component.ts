import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import SharedModule from 'app/shared/shared.module';
import { ChannelPreviewComponent } from 'app/pages/channel/channel-preview/channel-preview.component';
import { ChannelService } from 'app/entities/channel/service/channel.service';

@Component({
  selector: 'jhi-my-channels',
  standalone: true,
  imports: [CommonModule, SharedModule, ChannelPreviewComponent],
  templateUrl: './my-channels.component.html',
  styleUrls: ['./my-channels.component.scss'],
})
export class MyChannelsComponent implements OnInit {
  channels: IChannelDTO[] = [];

  constructor(protected channelService: ChannelService) {}

  ngOnInit(): void {
    this.channelService.getSubscribed().subscribe(r => {
      if (r.body) {
        console.log(r.body);
        this.channels = r.body;
      }
    });
  }
}

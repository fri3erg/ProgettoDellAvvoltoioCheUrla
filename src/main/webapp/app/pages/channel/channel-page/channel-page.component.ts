import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';

@Component({
  selector: 'jhi-channel-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss'],
})
export class ChannelPageComponent implements OnInit {
  channel?: IChannelDTO;
  channelId?: string;
  squeals?: ISquealDTO[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected squealService: SquealService, protected channelService: ChannelService) {}

  ngOnInit(): void {
    this.channelId = this.activatedRoute.snapshot.paramMap.get('id')?.toString();
    if (this.channelId) {
      this.channelService.findDTO(this.channelId).subscribe(r => {
        if (r.body) {
          this.channel = r.body;
        }
      });
      this.squealService.getSquealByChannel(this.channelId);
    }
  }
}

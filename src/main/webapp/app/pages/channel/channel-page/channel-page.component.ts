import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';
import { CreateSquealComponent } from 'app/pages/squeal/create-squeal/create-squeal.component';

@Component({
  selector: 'jhi-channel-page',
  standalone: true,
  imports: [CommonModule, ObserveElementDirective, CreateSquealComponent],
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss'],
})
export class ChannelPageComponent implements OnInit {
  channel?: IChannelDTO;
  channelId?: string;
  squeals: ISquealDTO[] = [];
  page = 0;
  size = 5;
  hasMorePage = false;
  isLoad = false;

  constructor(protected activatedRoute: ActivatedRoute, protected squealService: SquealService, protected channelService: ChannelService) {}

  ngOnInit(): void {
    this.channelId = this.activatedRoute.snapshot.paramMap.get('id')?.toString();
    if (this.channelId) {
      this.loadSqueals();
    }
  }
  loadSqueals(): void {
    console.log('load');
    this.channelService.findDTO(this.channelId ?? '').subscribe(r => {
      this.squeals = [];
      if (r.body) {
        this.channel = r.body;
      }
    });

    this.squealService.getSquealByChannel(this.channelId ?? '', this.page, this.size).subscribe(r => {
      this.squeals = [];
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = r.body;
      }
    });
  }

  appendSqueals(): void {
    console.log('load');
    this.squealService.getSquealByChannel(this.channelId ?? '', this.page, 5).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = [...this.squeals.concat(r.body)];
      }
    });
  }

  createdSqueal(): void {
    this.loadSqueals();
  }

  isIntersecting(event: boolean): void {
    console.log(`Element is intersecting`);
    console.log(event);
    if (!event) {
      this.isLoad = true;
    } else if (this.isLoad && this.hasMorePage) {
      this.appendSqueals();
      this.isLoad = false;
    }
  }
}

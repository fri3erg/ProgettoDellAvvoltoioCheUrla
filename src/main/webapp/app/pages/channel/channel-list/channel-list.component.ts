import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-channel-list',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
})
export class ChannelListComponent implements OnInit {
  searchKey = ' ';
  createName = ' ';

  channels: IChannelDTO[] = [];

  constructor(protected channelService: ChannelService) {}

  ngOnInit(): void {
    console.log('TEST');
  }

  search(): void {
    this.channelService.search(this.searchKey).subscribe(r => {
      if (r.body) {
        this.channels = r.body;
      }
    });
  }

  createChannel(): void {
    // TODO create
  }
}

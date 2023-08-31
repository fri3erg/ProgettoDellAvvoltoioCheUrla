import { Component, OnInit } from '@angular/core';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-channel-view',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './channel-view.component.html',
  styleUrls: ['./channel-view.component.scss'],
})
export class ChannelViewComponent implements OnInit {
  dto?: IChannelDTO;

  constructor(protected activatedRoute: ActivatedRoute, protected channelService: ChannelService) {}

  ngOnInit(): void {
    // TODO: To edit arrive with id
    this.activatedRoute.data.subscribe(({ channel }) => {
      this.dto = channel;
    });
  }

  createChannel(): void {
    if (!this.dto) {
      return;
    }
    this.channelService.insertOrUpdate(this.dto).subscribe(r => {
      if (r.body) {
        this.dto = r.body;
        console.log(this.dto);
      }
    });
  }
}

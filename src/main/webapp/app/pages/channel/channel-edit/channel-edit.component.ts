import { Component, OnInit } from '@angular/core';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';
import { MessageService, SelectItem } from 'primeng/api';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
import { IChannel } from 'app/entities/channel/channel.model';

@Component({
  selector: 'jhi-channel-edit',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.scss'],
})
export class ChannelEditComponent implements OnInit {
  dto: IChannelDTO = {
    channel: { name: '' },
    users: [],
  };
  messages = {};
  private = 'true';

  constructor(protected activatedRoute: ActivatedRoute, protected channelService: ChannelService, private messageService: MessageService) {}

  ngOnInit(): void {
    // TODO: To edit arrive with id
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
}

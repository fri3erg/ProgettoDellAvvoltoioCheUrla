import { Component, OnInit } from '@angular/core';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-channel-edit',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.scss'],
})
export class ChannelEditComponent implements OnInit {
  dto?: IChannelDTO;
  messages = {};

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
    const q: string = this.dto?.channel.name ?? '';
    return !this.dto || q.includes('§') || q.includes('#') || q.includes('@') || q.toLowerCase() !== q;
  }

  createChannel(): void {
    const q: string = this.dto?.channel.name ?? '';
    if (!this.dto) {
      return;
    }
    this.dto.channel.name = '§' + q;
    this.channelService.insertOrUpdate(this.dto).subscribe(r => {
      if (r.body) {
        this.dto = r.body;
        console.log(this.dto);
        this.dto.channel.name = '';
      }
    });
  }
}

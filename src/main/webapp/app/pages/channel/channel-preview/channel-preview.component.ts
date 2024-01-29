import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import SharedModule from 'app/shared/shared.module';
import { ChannelSubscribeComponent } from '../channel-subscribe/channel-subscribe.component';

@Component({
  selector: 'jhi-channel-preview',
  standalone: true,
  imports: [CommonModule, SharedModule, ChannelSubscribeComponent],
  templateUrl: './channel-preview.component.html',
  styleUrls: ['./channel-preview.component.scss'],
})
export class ChannelPreviewComponent {
  @Input({ required: true }) channel?: IChannelDTO;
}

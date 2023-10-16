import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';
import { NewChannelUser } from 'app/entities/channel-user/channel-user.model';
import { Account } from 'app/core/auth/account.model';
import { Subject, takeUntil } from 'rxjs';
import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { IChannelDTO } from 'app/shared/model/channelDTO-model';

@Component({
  selector: 'jhi-channel-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-page.component.html',
  styleUrls: ['./channel-page.component.scss']
})
export class ChannelPageComponent implements OnInit{
  dto?: IChannelDTO;
channelId?:string;

  constructor(protected activatedRoute: ActivatedRoute, protected channelService: ChannelService) {}


  ngOnInit(): void {
    this.channelId = this.activatedRoute.snapshot.paramMap.get('id')?.toString();    

  }
}

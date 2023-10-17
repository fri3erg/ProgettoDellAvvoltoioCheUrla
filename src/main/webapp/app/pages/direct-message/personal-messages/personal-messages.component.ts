import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { Account } from 'app/core/auth/account.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'jhi-personal-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-messages.component.html',
  styleUrls: ['./personal-messages.component.scss'],
})
export class PersonalMessagesComponent implements OnInit {
  username?: string | null;
  squeals?: ISquealDTO[];
  account: Account | null = null;

  constructor(protected squealService: SquealService, protected channelService: ChannelService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
    if (this.username) {
      this.squealService.getSquealByUser(this.username).subscribe(r => {
        if (r.body) {
          this.squeals = r.body;
          console.log(this.squeals);
        }
      });
    }
  }
}

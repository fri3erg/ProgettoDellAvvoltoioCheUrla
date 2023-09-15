import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import SharedModule from 'app/shared/shared.module';
import { SquealService } from 'app/entities/squeal/service/squeal.service';

@Component({
  selector: 'jhi-direct-message',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './direct-message.component.html',
  styleUrls: ['./direct-message.component.scss'],
})
export class DirectMessageComponent {
  squeal: ISquealDTO[] = [];
  constructor(private squealService: SquealService) {}
}

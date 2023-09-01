import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';

@Component({
  selector: 'jhi-squeal-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './squeal-view.component.html',
  styleUrls: ['./squeal-view.component.scss'],
})
export class SquealViewComponent implements OnInit {
  @Input() squeal?: ISquealDTO;

  constructor(private squealService: SquealService) {}

  ngOnInit(): void {
    console.log(this.squeal);
  }
}

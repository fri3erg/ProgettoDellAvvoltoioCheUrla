import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-create-squeal',
  templateUrl: './create-squeal.component.html',
  styleUrls: ['./create-squeal.component.scss'],
  imports: [SharedModule, FormsModule, RouterModule],
})
export class CreateSquealComponent implements OnInit {
  destinations: string[] = [];
  message = '';

  dto?: ISquealDTO;

  constructor(protected squealService: SquealService) {}

  ngOnInit(): void {
    // TODO: To edit arrive with id

    this.dto = {
      squeal: {},
    };
  }

  createSqueal(): void {
    if (!this.dto?.squeal) {
      return;
    }

    this.dto.squeal.body = this.message;
    const dest: ISquealDestination[] = [];
    for (const d of this.destinations) {
      dest.push({
        destination: d,
      });
    }

    this.dto.squeal.destinations = dest;
    console.log('insert');
    console.log(this.dto);
    this.squealService.insertOrUpdate(this.dto).subscribe(r => {
      if (r.body) {
        this.dto = r.body;
        this.message = this.dto.squeal?.body ?? '';
        this.destinations = [];
        if (this.dto.squeal?.destinations) {
          for (const d of this.dto.squeal.destinations) {
            if (d.destination) {
              this.destinations.push(d.destination);
            }
          }
        }
        console.log(this.dto);
      }
    });
  }
}

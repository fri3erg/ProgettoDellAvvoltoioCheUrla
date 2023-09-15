import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { UserCharsService } from 'app/entities/user-chars/service/user-chars.service';
import { IUserCharsDTO, Type } from 'app/entities/user-chars/user-chars.model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import SharedModule from 'app/shared/shared.module';
import { MessageService } from 'primeng/api';

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
  results?: string[];
  dto?: ISquealDTO;
  charsDTO?: IUserCharsDTO;
  @Output() squealed: EventEmitter<boolean> = new EventEmitter();

  constructor(
    protected squealService: SquealService,
    private messageService: MessageService,
    protected userCharsService: UserCharsService
  ) {}

  ngOnInit(): void {
    // TODO: To edit arrive with id

    this.dto = {
      squeal: {},
    };
    this.userCharsService.getChars().subscribe(r => {
      if (r.body) {
        this.charsDTO = r.body;
      }
    });
  }

  getType(): string {
    if (this.charsDTO?.type === Type.DAY) {
      return 'giorno';
    }
    if (this.charsDTO?.type === Type.WEEK) {
      return 'settimana';
    } else {
      return 'mese';
    }
  }

  getRemainingChars(): number {
    return (this.charsDTO?.remainingChars ?? 0) - this.message.length;
  }

  search(event: any): void {
    const q: string = event.query;
    console.log(q);

    this.squealService.findDestinations(q).subscribe(r => {
      this.results = [];
      if (r.body) {
        this.results = r.body;
      }
      if (q.startsWith('#')) {
        this.results.push(q);
      }
    });
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
        this.messageService.add({ severity: 'success', summary: 'Squeal Squealed', detail: 'you squealed' });
        this.destinations = [];
        this.message = '';
        this.dto = { squeal: {} };
        this.squealed.emit(true);
      }
    });
  }
}

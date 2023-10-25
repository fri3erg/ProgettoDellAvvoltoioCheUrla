import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IReactionDTO, ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealReaction } from 'app/entities/squeal-reaction/squeal-reaction.model';
import { SquealReactionService } from 'app/entities/squeal-reaction/service/squeal-reaction.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'jhi-squeal-view',
  standalone: true,
  imports: [CommonModule, SpeedDialModule, ChipModule],
  templateUrl: './squeal-view.component.html',
  styleUrls: ['./squeal-view.component.scss'],
})
export class SquealViewComponent implements OnInit {
  @Input() squeal?: ISquealDTO;
  reactionAdded?: string;
  reactions: MenuItem[] = [
    {
      icon: 'heart',
      command: () => {
        this.addReaction('heart', true);
      },
    },
    {
      icon: 'exploding',
      command: () => {
        this.addReaction('exploding', true);
      },
    },
    {
      icon: 'cold',
      command: () => {
        this.addReaction('cold', true);
      },
    },
    {
      icon: 'nerd',
      command: () => {
        this.addReaction('nerd', false);
      },
    },
    {
      icon: 'clown',
      command: () => {
        this.addReaction('clown', false);
      },
    },
    {
      icon: 'bored',
      command: () => {
        this.addReaction('bored', false);
      },
    },
  ];

  constructor(private squealService: SquealService, private squealReactionService: SquealReactionService) {}

  ngOnInit(): void {
    console.log(this.squeal);
  }

  addReaction(emoji: string, positive: boolean): void {
    const r: ISquealReaction = {
      positive,
      emoji,
      squeal_id: this.squeal?.squeal?.id,
    };
    this.squealReactionService.createorUpdate(r).subscribe(ret => {
      if (ret.body) {
        console.log(ret.body);
        if (this.squeal) {
          this.squeal.reactions = ret.body;
        }
      }
    });
  }
}

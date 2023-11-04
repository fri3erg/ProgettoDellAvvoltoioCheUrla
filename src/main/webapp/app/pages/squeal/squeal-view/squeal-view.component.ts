import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IReactionDTO, ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealReaction } from 'app/entities/squeal-reaction/squeal-reaction.model';
import { SquealReactionService } from 'app/entities/squeal-reaction/service/squeal-reaction.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { Router } from '@angular/router';

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

  constructor(private squealService: SquealService, private squealReactionService: SquealReactionService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.squeal);
  }

  isActive(reaction: string): string {
    if (reaction === this.squeal?.active_reaction) {
      return 'active-emoji';
    }
    return '';
  }

  addReaction(emoji: string, positive: boolean): void {
    const r: ISquealReaction = {
      positive,
      emoji,
      squeal_id: this.squeal?.squeal?._id?.toString(),
    };

    this.squealReactionService.createorUpdate(r).subscribe(ret => {
      if (ret.body && this.squeal) {
        console.log(ret.body);
        const reaction = ret.body;
        let cr = this.squeal.reactions?.find(i => i.reaction === this.squeal?.active_reaction);

        if (this.squeal.active_reaction) {
          if (cr?.number) {
            cr.number--;
            if (cr.number <= 0) {
              this.squeal.reactions?.splice(this.squeal.reactions.indexOf(cr));
            }
          }
          if (reaction.emoji === 'deleted') {
            this.squeal.active_reaction = null;
            return;
          }
        }
        cr = this.squeal.reactions?.find(i => i.reaction === reaction.emoji);
        if (cr?.number) {
          cr.number++;
        } else {
          const dto: IReactionDTO = {
            number: 1,
            reaction: reaction.emoji ?? 'deleted',
            user: false,
          };
          this.squeal.reactions?.push(dto);
        }
        this.squeal.active_reaction = reaction.emoji;
        console.log(this.squeal);
      }
    });
  }
  redirect(dest: ISquealDestination): void {
    let type = '/channels/view/';
    let id = dest.destination_id;
    if (dest.destination_type === 'MESSAGE') {
      type = 'profile';
      id = dest.destination;
    }

    this.router.navigate([type, id]);
  }
}

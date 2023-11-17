import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IReactionDTO, ISquealDTO } from 'app/shared/model/squealDTO-model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ISquealReaction } from 'app/entities/squeal-reaction/squeal-reaction.model';
import { SquealReactionService } from 'app/entities/squeal-reaction/service/squeal-reaction.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem, MessageService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { Router } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { CreateSquealComponent } from '../create-squeal/create-squeal.component';
import { Loader, LoaderOptions } from 'google-maps';

@Component({
  selector: 'jhi-squeal-view',
  standalone: true,
  imports: [CommonModule, SpeedDialModule, ChipModule, SharedModule, CreateSquealComponent],
  templateUrl: './squeal-view.component.html',
  styleUrls: ['./squeal-view.component.scss'],
})
export class SquealViewComponent implements OnInit, AfterViewInit {
  @Input() squeal?: ISquealDTO;
  reactionAdded?: string;
  response_squeal?: ISquealDTO;
  reply = false;
  innerBody = '';
  squealed = false;
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

  constructor(
    private squealService: SquealService,
    private messageService: MessageService,
    private squealReactionService: SquealReactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.squeal?.squeal) {
      this.messageService.add({ severity: 'error', summary: 'Squeal not found', detail: 'squeal does not exist' });
      return;
    }
    if (!this.squeal.squeal.body) {
      this.squeal.squeal.body = 'squeal not found';
    }

    console.log(this.squeal.squeal.body);
    this.innerBody = this.urlify(this.squeal.squeal.body);

    if (this.squeal.squeal.squeal_id_response) {
      this.squealService.getSquealById(this.squeal.squeal.squeal_id_response).subscribe(r => {
        if (r.body) {
          this.response_squeal = r.body;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.squeal?.geoLoc?.latitude && this.squeal.geoLoc.longitude) {
      const loader = this.squealService.getLoader();
      const myMap = document.getElementById('map_' + (this.squeal.squeal?._id?.toString() ?? ''));
      console.log('map_' + (this.squeal.squeal?._id?.toString() ?? ''));
      const svgMarker = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        fillColor: 'red',
        fillOpacity: 0,
        strokeWeight: 0,
        rotation: 0,
        scale: 7,
        anchor: new google.maps.Point(0, 0),
      };
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (myMap && loader) {
        const lat = this.squeal.geoLoc.latitude;
        const lng = this.squeal.geoLoc.longitude;
        const heading = this.squeal.geoLoc.heading;
        loader.load().then(function (google) {
          const map = new google.maps.Map(myMap, {
            center: { lat, lng },
            heading: heading ?? 0,
            zoom: 8,
          });
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            icon: svgMarker,
            title: 'You!',
          });
        });
      }
    }
  }

  onSquealed(event: any): void {
    this.squealed = true;
  }
  urlify(text: string): string {
    const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/g;
    return text.replace(urlRegex, url => '<a href="' + url + '">' + url + '</a>');
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
    console.log(r);
    this.squealReactionService.createorUpdate(r).subscribe(ret => {
      if (ret.body && this.squeal) {
        console.log(ret.body);
        const reaction = ret.body;
        let cr = this.squeal.reactions?.find(i => i.reaction === this.squeal?.active_reaction);

        if (this.squeal.active_reaction) {
          if (cr?.number) {
            cr.number--;
            if (cr.number <= 0) {
              this.squeal.reactions?.splice(this.squeal.reactions.indexOf(cr), 1);
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

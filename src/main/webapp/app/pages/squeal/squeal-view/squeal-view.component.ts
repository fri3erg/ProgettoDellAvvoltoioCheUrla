import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-squeal-view',
  standalone: true,
  imports: [CommonModule, SpeedDialModule, ChipModule, SharedModule, CreateSquealComponent],
  templateUrl: './squeal-view.component.html',
  styleUrls: ['./squeal-view.component.scss'],
})
export class SquealViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() squeal?: ISquealDTO;
  reactionAdded?: string;
  response_squeal?: ISquealDTO;
  reply = false;
  innerBody = '';
  map?: google.maps.Map; // Hold the map instance
  markers: google.maps.Marker[] = []; // Hold all markers
  polyline?: google.maps.Polyline; // Hold the polyline
  squealed = false;
  isApiCallInProgress = false;
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
  account: Account | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private squealService: SquealService,
    private messageService: MessageService,
    private squealReactionService: SquealReactionService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (!this.squeal?.squeal) {
      this.messageService.add({ severity: 'error', summary: 'Squeal not found', detail: 'squeal does not exist' });
      return;
    }
    if (this.squeal.squeal.body) {
      this.innerBody = this.urlify(this.squeal.squeal.body);
    }

    if (this.squeal.squeal.squeal_id_response) {
      this.squealService.getSquealById(this.squeal.squeal.squeal_id_response).subscribe(r => {
        if (r.body) {
          this.response_squeal = r.body;
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.addMap();
    if (this.squeal?.geoLoc?.refresh) {
      this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(a => {
          this.account = a;
          console.log(a);
          this.startRefresh();
        });
    }
  }
  addMap(): void {
    if (this.squeal?.geoLoc?.latitude && this.squeal.geoLoc.longitude) {
      console.log('add map');
      const myMap = document.getElementById('map_' + (this.squeal.squeal?._id?.toString() ?? ''));
      console.log('map_' + (this.squeal.squeal?._id?.toString() ?? ''));

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (myMap) {
        const heading = this.squeal.geoLoc.heading;
        this.squealService.getGoogle().subscribe(() => {
          if (!(this.squeal?.geoLoc?.latitude && this.squeal.geoLoc.longitude)) {
            return;
          }
          const latlng = new google.maps.LatLng(this.squeal.geoLoc.latitude, this.squeal.geoLoc.longitude);
          this.map = new google.maps.Map(myMap, {
            center: latlng,
            heading: heading ?? 0,
            zoom: 13,
          });
          this.polyline = new google.maps.Polyline({
            map: this.map,
            path: [],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          const svgMarker = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: 'red',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 5,
            anchor: new google.maps.Point(0, 0),
          };

          const marker = new google.maps.Marker({
            position: latlng,
            map: this.map,
            title: 'You!',
            icon: svgMarker,
          });
          this.markers.push(marker); // Add marker to array
        });
      }
    }
  }
  startRefresh(): void {
    if (this.squeal?.geoLoc?.timestamp && this.squeal.geoLoc.refresh && this.squeal.geoLoc.timestamp > Date.now() - 3600000) {
      if (this.squeal.userName === this.account?.login) {
        navigator.geolocation.getCurrentPosition(
          position => {
            if (this.squeal?.geoLoc) {
              this.squeal.geoLoc.longitude = position.coords.longitude;
              this.squeal.geoLoc.latitude = position.coords.latitude;
              this.squeal.geoLoc.accuracy = position.coords.accuracy;
              this.squeal.geoLoc.heading = position.coords.heading;
              this.squeal.geoLoc.speed = position.coords.speed;
              this.squeal.geoLoc.refresh = true;
              this.squealService.updateGeoLoc(this.squeal.geoLoc).subscribe(r => {
                if (r.body && this.squeal) {
                  this.squeal.geoLoc = r.body;
                  console.log(this.squeal.geoLoc);
                  this.updatePosition();
                }
              });
            }
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.squealService.getPosition(this.squeal.squeal?._id?.toString() ?? '').subscribe(r => {
          if (r.body && this.squeal) {
            this.squeal.geoLoc = r.body;
          }
        });
      }
      setTimeout(() => {
        this.startRefresh();
      }, 10000);
      return;
    }
    return;
  }

  updatePosition(): void {
    if (this.squeal?.geoLoc?.latitude && this.squeal.geoLoc.longitude && this.map) {
      const newLatLng = new google.maps.LatLng(this.squeal.geoLoc.latitude, this.squeal.geoLoc.longitude);
      this.map.panTo(newLatLng); // Pan map to new position

      const marker = new google.maps.Marker({
        position: newLatLng,
        map: this.map,
        title: 'New Position',
      });

      this.markers.push(marker); // Add marker to array

      const path = this.polyline?.getPath();
      if (path) {
        path.push(newLatLng); // Add new position to the polyline path
        this.polyline?.setPath(path); // Update the polyline with the new path
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
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.squealReactionService.createorUpdate(r).subscribe(ret => {
        if (ret.body && this.squeal) {
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
              this.isApiCallInProgress = false;
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
        }
        this.isApiCallInProgress = false;
      });
    }
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

  timeDifference(previous: any): string {
    const current = Date.now();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000).toString() + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute).toString() + ' minutes ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour).toString() + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay).toString() + ' days ago';
    } else if (elapsed < msPerYear) {
      return 'about ' + Math.round(elapsed / msPerMonth).toString() + ' months ago';
    } else {
      return 'about ' + Math.round(elapsed / msPerYear).toString() + ' years ago';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

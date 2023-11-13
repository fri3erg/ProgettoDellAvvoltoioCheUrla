import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IGeolocationCoordinates } from 'app/entities/geolocation-coordinates/geolocation-coordinates.model';

import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { UserCharsService } from 'app/entities/user-chars/service/user-chars.service';
import { IUserCharsDTO } from 'app/entities/user-chars/user-chars.model';
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
  message = '';
  results?: ISquealDestination[];
  dto?: ISquealDTO;
  charsDTO?: IUserCharsDTO;
  loader = this.squealService.getLoader();
  geoLoc?: IGeolocationCoordinates;
  @Input() destination: ISquealDestination[] = [];
  @Input() response?: string;
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
    if (this.charsDTO?.type === 'DAY') {
      return 'giorno';
    }
    if (this.charsDTO?.type === 'WEEK') {
      return 'settimana';
    } else {
      return 'mese';
    }
  }

  getRemainingChars(): number {
    // TODO:change back to 0 in each
    return (this.charsDTO?.remainingChars ?? 100) - this.message.length;
  }

  search(event: any): void {
    const q: string = event.query;
    console.log(q);

    this.squealService.findDestinations(q).subscribe(r => {
      this.results = [];
      if (r.body) {
        for (const dest of r.body) {
          this.results.push(dest);
        }
      }
    });
  }
  createSqueal(): void {
    if (!this.dto?.squeal) {
      return;
    }
    this.dto.squeal.squeal_id_response = this.response;
    this.dto.squeal.body = this.message;
    this.dto.squeal.destination = this.destination;
    this.dto.geoLoc = this.geoLoc;
    console.log('insert');
    console.log(this.dto);
    this.squealService.insertOrUpdate(this.dto).subscribe(r => {
      if (r.body) {
        this.dto = r.body;
        this.message = this.dto.squeal?.body ?? '';
        this.destination = [];
        if (this.dto.squeal?.destination) {
          for (const d of this.dto.squeal.destination) {
            if (d.destination) {
              this.destination.push(d);
            }
          }
        }
        console.log(this.dto);
        this.messageService.add({ severity: 'success', summary: 'Squeal Squealed', detail: 'you squealed' });
        this.destination = [];
        this.message = '';
        this.dto = { squeal: {} };
        this.squealed.emit(true);
      }
    });
  }
  addGeo(): void {
    const myMap = document.getElementById('map_create');
    console.log('map_create');
    if (myMap && this.loader) {
      const lat = 3;
      const lng = 3;
      this.loader.load().then(function (google) {
        const map = new google.maps.Map(myMap, {
          center: { lat, lng },
          zoom: 8,
        });
      });
    }
  }

  setFileData(event: any): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      if (!file.type.startsWith('image/')) {
        // message serivce errpr
        return;
      } else {
        this.toBase64(file, (base64Data: string) => {
          if (!this.dto?.squeal) {
            return;
          }
          this.dto.squeal.img = base64Data;
          this.dto.squeal.img_content_type = file.type;
        });
      }
    } else {
      // message service no file selected
    }
  }

  rotateImage(): void {
    if (!this.dto?.squeal?.img_content_type || !this.dto.squeal.img) {
      return;
    }
    const prev = this.dto.squeal.img;
    const base = 'data:' + this.dto.squeal.img_content_type + ';base64,';
    let result = this.rotateBase64Image90deg(base + prev, true);
    result = result.replace(base, '');
    this.dto.squeal.img = result;
  }

  rotateBase64Image90deg(base64Image: string, isClockwise: boolean): string {
    // create an off-screen canvas
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCanvasCtx = offScreenCanvas.getContext('2d');

    // cteate Image
    const img = new Image();
    img.src = base64Image;

    // set its dimension to rotated size
    offScreenCanvas.height = img.width;
    offScreenCanvas.width = img.height;

    // rotate and draw source image into the off-screen canvas:
    if (isClockwise) {
      offScreenCanvasCtx?.rotate((90 * Math.PI) / 180);
      offScreenCanvasCtx?.translate(0, -offScreenCanvas.width);
    } else {
      offScreenCanvasCtx?.rotate((-90 * Math.PI) / 180);
      offScreenCanvasCtx?.translate(-offScreenCanvas.height, 0);
    }
    offScreenCanvasCtx?.drawImage(img, 0, 0);

    // encode image to data-uri with base64
    const ret = offScreenCanvas.toDataURL('image/jpeg', 100);
    return ret;
  }

  clearInputImage(): void {
    if (!this.dto?.squeal) {
      return;
    }
    this.dto.squeal.img = undefined;
    this.dto.squeal.img_content_type = undefined;
    // if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
    // this.elementRef.nativeElement.querySelector('#' + idInput).value =null;
    // }
  }

  byteSize(base64String?: string | null): string {
    if (!base64String) {
      return '';
    }
    return this.formatAsBytes(this.size(base64String));
  }

  /**
   * Method to convert the file to base64
   */
  private toBase64(file: File, callback: (base64Data: string) => void): void {
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result === 'string') {
        const base64Data: string = e.target.result.substring(e.target.result.indexOf('base64,') + 'base64,'.length);
        callback(base64Data);
      }
    };
    fileReader.readAsDataURL(file);
  }

  private endsWith(suffix: string, str: string): boolean {
    return str.includes(suffix, str.length - suffix.length);
  }

  private paddingSize(value: string): number {
    if (this.endsWith('==', value)) {
      return 2;
    }
    if (this.endsWith('=', value)) {
      return 1;
    }
    return 0;
  }

  private size(value: string): number {
    return (value.length / 4) * 3 - this.paddingSize(value);
  }

  private formatAsBytes(size?: number | null): string {
    if (!size) {
      return '';
    }
    return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes'; // NOSONAR
  }
}

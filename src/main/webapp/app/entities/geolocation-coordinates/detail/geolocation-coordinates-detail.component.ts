import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IGeolocationCoordinates } from '../geolocation-coordinates.model';

@Component({
  standalone: true,
  selector: 'jhi-geolocation-coordinates-detail',
  templateUrl: './geolocation-coordinates-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class GeolocationCoordinatesDetailComponent {
  @Input() geolocationCoordinates: IGeolocationCoordinates | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}

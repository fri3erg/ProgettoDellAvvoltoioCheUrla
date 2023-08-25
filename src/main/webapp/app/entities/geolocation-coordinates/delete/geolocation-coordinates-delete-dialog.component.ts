import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IGeolocationCoordinates } from '../geolocation-coordinates.model';
import { GeolocationCoordinatesService } from '../service/geolocation-coordinates.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './geolocation-coordinates-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GeolocationCoordinatesDeleteDialogComponent {
  geolocationCoordinates?: IGeolocationCoordinates;

  constructor(protected geolocationCoordinatesService: GeolocationCoordinatesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.geolocationCoordinatesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ISquealViews } from '../squeal-views.model';
import { SquealViewsService } from '../service/squeal-views.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './squeal-views-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SquealViewsDeleteDialogComponent {
  squealViews?: ISquealViews;

  constructor(protected squealViewsService: SquealViewsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.squealViewsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ISquealCat } from '../squeal-cat.model';
import { SquealCatService } from '../service/squeal-cat.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './squeal-cat-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SquealCatDeleteDialogComponent {
  squealCat?: ISquealCat;

  constructor(protected squealCatService: SquealCatService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.squealCatService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ISMMVIP } from '../smmvip.model';
import { SMMVIPService } from '../service/smmvip.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './smmvip-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SMMVIPDeleteDialogComponent {
  sMMVIP?: ISMMVIP;

  constructor(protected sMMVIPService: SMMVIPService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.sMMVIPService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

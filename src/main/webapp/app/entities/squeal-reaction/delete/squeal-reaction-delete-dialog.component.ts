import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ISquealReaction } from '../squeal-reaction.model';
import { SquealReactionService } from '../service/squeal-reaction.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './squeal-reaction-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SquealReactionDeleteDialogComponent {
  squealReaction?: ISquealReaction;

  constructor(protected squealReactionService: SquealReactionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.squealReactionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

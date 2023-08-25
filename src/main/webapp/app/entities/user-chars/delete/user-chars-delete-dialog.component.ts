import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IUserChars } from '../user-chars.model';
import { UserCharsService } from '../service/user-chars.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './user-chars-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserCharsDeleteDialogComponent {
  userChars?: IUserChars;

  constructor(protected userCharsService: UserCharsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.userCharsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

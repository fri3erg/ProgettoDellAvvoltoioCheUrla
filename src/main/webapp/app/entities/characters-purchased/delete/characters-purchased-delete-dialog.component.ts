import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ICharactersPurchased } from '../characters-purchased.model';
import { CharactersPurchasedService } from '../service/characters-purchased.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './characters-purchased-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CharactersPurchasedDeleteDialogComponent {
  charactersPurchased?: ICharactersPurchased;

  constructor(protected charactersPurchasedService: CharactersPurchasedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.charactersPurchasedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

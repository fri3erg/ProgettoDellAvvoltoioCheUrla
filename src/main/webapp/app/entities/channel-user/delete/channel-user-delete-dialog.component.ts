import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IChannelUser } from '../channel-user.model';
import { ChannelUserService } from '../service/channel-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './channel-user-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ChannelUserDeleteDialogComponent {
  channelUser?: IChannelUser;

  constructor(protected channelUserService: ChannelUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.channelUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

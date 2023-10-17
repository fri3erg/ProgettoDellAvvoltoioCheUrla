import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from 'app/core/auth/account.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-user-preview',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
})
export class UserPreviewComponent {
  @Input({ required: true }) user?: Account;
}

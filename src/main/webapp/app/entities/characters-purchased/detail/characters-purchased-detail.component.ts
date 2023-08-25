import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICharactersPurchased } from '../characters-purchased.model';

@Component({
  standalone: true,
  selector: 'jhi-characters-purchased-detail',
  templateUrl: './characters-purchased-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CharactersPurchasedDetailComponent {
  @Input() charactersPurchased: ICharactersPurchased | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}

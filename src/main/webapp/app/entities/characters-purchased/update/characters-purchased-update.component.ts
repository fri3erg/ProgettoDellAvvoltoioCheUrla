import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CharactersPurchasedFormService, CharactersPurchasedFormGroup } from './characters-purchased-form.service';
import { ICharactersPurchased } from '../characters-purchased.model';
import { CharactersPurchasedService } from '../service/characters-purchased.service';

@Component({
  standalone: true,
  selector: 'jhi-characters-purchased-update',
  templateUrl: './characters-purchased-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CharactersPurchasedUpdateComponent implements OnInit {
  isSaving = false;
  charactersPurchased: ICharactersPurchased | null = null;

  editForm: CharactersPurchasedFormGroup = this.charactersPurchasedFormService.createCharactersPurchasedFormGroup();

  constructor(
    protected charactersPurchasedService: CharactersPurchasedService,
    protected charactersPurchasedFormService: CharactersPurchasedFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charactersPurchased }) => {
      this.charactersPurchased = charactersPurchased;
      if (charactersPurchased) {
        this.updateForm(charactersPurchased);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const charactersPurchased = this.charactersPurchasedFormService.getCharactersPurchased(this.editForm);
    if (charactersPurchased.id !== null) {
      this.subscribeToSaveResponse(this.charactersPurchasedService.update(charactersPurchased));
    } else {
      this.subscribeToSaveResponse(this.charactersPurchasedService.create(charactersPurchased));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharactersPurchased>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(charactersPurchased: ICharactersPurchased): void {
    this.charactersPurchased = charactersPurchased;
    this.charactersPurchasedFormService.resetForm(this.editForm, charactersPurchased);
  }
}

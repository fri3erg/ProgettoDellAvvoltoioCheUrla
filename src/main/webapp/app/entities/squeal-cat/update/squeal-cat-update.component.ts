import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SquealCatFormService, SquealCatFormGroup } from './squeal-cat-form.service';
import { ISquealCat } from '../squeal-cat.model';
import { SquealCatService } from '../service/squeal-cat.service';
import { CategoryTypes } from 'app/entities/enumerations/category-types.model';

@Component({
  standalone: true,
  selector: 'jhi-squeal-cat-update',
  templateUrl: './squeal-cat-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SquealCatUpdateComponent implements OnInit {
  isSaving = false;
  squealCat: ISquealCat | null = null;
  categoryTypesValues = Object.keys(CategoryTypes);

  editForm: SquealCatFormGroup = this.squealCatFormService.createSquealCatFormGroup();

  constructor(
    protected squealCatService: SquealCatService,
    protected squealCatFormService: SquealCatFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ squealCat }) => {
      this.squealCat = squealCat;
      if (squealCat) {
        this.updateForm(squealCat);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const squealCat = this.squealCatFormService.getSquealCat(this.editForm);
    if (squealCat.id !== null) {
      this.subscribeToSaveResponse(this.squealCatService.update(squealCat));
    } else {
      this.subscribeToSaveResponse(this.squealCatService.create(squealCat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISquealCat>>): void {
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

  protected updateForm(squealCat: ISquealCat): void {
    this.squealCat = squealCat;
    this.squealCatFormService.resetForm(this.editForm, squealCat);
  }
}

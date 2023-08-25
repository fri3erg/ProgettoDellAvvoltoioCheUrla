import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SquealViewsFormService, SquealViewsFormGroup } from './squeal-views-form.service';
import { ISquealViews } from '../squeal-views.model';
import { SquealViewsService } from '../service/squeal-views.service';

@Component({
  standalone: true,
  selector: 'jhi-squeal-views-update',
  templateUrl: './squeal-views-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SquealViewsUpdateComponent implements OnInit {
  isSaving = false;
  squealViews: ISquealViews | null = null;

  editForm: SquealViewsFormGroup = this.squealViewsFormService.createSquealViewsFormGroup();

  constructor(
    protected squealViewsService: SquealViewsService,
    protected squealViewsFormService: SquealViewsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ squealViews }) => {
      this.squealViews = squealViews;
      if (squealViews) {
        this.updateForm(squealViews);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const squealViews = this.squealViewsFormService.getSquealViews(this.editForm);
    if (squealViews.id !== null) {
      this.subscribeToSaveResponse(this.squealViewsService.update(squealViews));
    } else {
      this.subscribeToSaveResponse(this.squealViewsService.create(squealViews));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISquealViews>>): void {
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

  protected updateForm(squealViews: ISquealViews): void {
    this.squealViews = squealViews;
    this.squealViewsFormService.resetForm(this.editForm, squealViews);
  }
}

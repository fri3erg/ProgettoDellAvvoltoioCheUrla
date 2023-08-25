import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SquealReactionFormService, SquealReactionFormGroup } from './squeal-reaction-form.service';
import { ISquealReaction } from '../squeal-reaction.model';
import { SquealReactionService } from '../service/squeal-reaction.service';

@Component({
  standalone: true,
  selector: 'jhi-squeal-reaction-update',
  templateUrl: './squeal-reaction-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SquealReactionUpdateComponent implements OnInit {
  isSaving = false;
  squealReaction: ISquealReaction | null = null;

  editForm: SquealReactionFormGroup = this.squealReactionFormService.createSquealReactionFormGroup();

  constructor(
    protected squealReactionService: SquealReactionService,
    protected squealReactionFormService: SquealReactionFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ squealReaction }) => {
      this.squealReaction = squealReaction;
      if (squealReaction) {
        this.updateForm(squealReaction);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const squealReaction = this.squealReactionFormService.getSquealReaction(this.editForm);
    if (squealReaction.id !== null) {
      this.subscribeToSaveResponse(this.squealReactionService.update(squealReaction));
    } else {
      this.subscribeToSaveResponse(this.squealReactionService.create(squealReaction));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISquealReaction>>): void {
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

  protected updateForm(squealReaction: ISquealReaction): void {
    this.squealReaction = squealReaction;
    this.squealReactionFormService.resetForm(this.editForm, squealReaction);
  }
}

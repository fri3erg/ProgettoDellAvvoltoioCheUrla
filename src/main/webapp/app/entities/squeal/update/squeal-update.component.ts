import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SquealFormService, SquealFormGroup } from './squeal-form.service';
import { ISqueal } from '../squeal.model';
import { SquealService } from '../service/squeal.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  standalone: true,
  selector: 'jhi-squeal-update',
  templateUrl: './squeal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SquealUpdateComponent implements OnInit {
  isSaving = false;
  squeal: ISqueal | null = null;

  editForm: SquealFormGroup = this.squealFormService.createSquealFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected squealService: SquealService,
    protected squealFormService: SquealFormService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ squeal }) => {
      this.squeal = squeal;
      if (squeal) {
        this.updateForm(squeal);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('avvoltoioCheUrlaApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const squeal = this.squealFormService.getSqueal(this.editForm);
    if (squeal._id !== null) {
      this.subscribeToSaveResponse(this.squealService.update(squeal));
    } else {
      this.subscribeToSaveResponse(this.squealService.create(squeal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISqueal>>): void {
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

  protected updateForm(squeal: ISqueal): void {
    this.squeal = squeal;
    this.squealFormService.resetForm(this.editForm, squeal);
  }
}

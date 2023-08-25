import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SMMVIPFormService, SMMVIPFormGroup } from './smmvip-form.service';
import { ISMMVIP } from '../smmvip.model';
import { SMMVIPService } from '../service/smmvip.service';

@Component({
  standalone: true,
  selector: 'jhi-smmvip-update',
  templateUrl: './smmvip-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SMMVIPUpdateComponent implements OnInit {
  isSaving = false;
  sMMVIP: ISMMVIP | null = null;

  editForm: SMMVIPFormGroup = this.sMMVIPFormService.createSMMVIPFormGroup();

  constructor(
    protected sMMVIPService: SMMVIPService,
    protected sMMVIPFormService: SMMVIPFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sMMVIP }) => {
      this.sMMVIP = sMMVIP;
      if (sMMVIP) {
        this.updateForm(sMMVIP);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sMMVIP = this.sMMVIPFormService.getSMMVIP(this.editForm);
    if (sMMVIP.id !== null) {
      this.subscribeToSaveResponse(this.sMMVIPService.update(sMMVIP));
    } else {
      this.subscribeToSaveResponse(this.sMMVIPService.create(sMMVIP));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISMMVIP>>): void {
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

  protected updateForm(sMMVIP: ISMMVIP): void {
    this.sMMVIP = sMMVIP;
    this.sMMVIPFormService.resetForm(this.editForm, sMMVIP);
  }
}

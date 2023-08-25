import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserCharsFormService, UserCharsFormGroup } from './user-chars-form.service';
import { IUserChars } from '../user-chars.model';
import { UserCharsService } from '../service/user-chars.service';

@Component({
  standalone: true,
  selector: 'jhi-user-chars-update',
  templateUrl: './user-chars-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserCharsUpdateComponent implements OnInit {
  isSaving = false;
  userChars: IUserChars | null = null;

  editForm: UserCharsFormGroup = this.userCharsFormService.createUserCharsFormGroup();

  constructor(
    protected userCharsService: UserCharsService,
    protected userCharsFormService: UserCharsFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userChars }) => {
      this.userChars = userChars;
      if (userChars) {
        this.updateForm(userChars);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userChars = this.userCharsFormService.getUserChars(this.editForm);
    if (userChars.id !== null) {
      this.subscribeToSaveResponse(this.userCharsService.update(userChars));
    } else {
      this.subscribeToSaveResponse(this.userCharsService.create(userChars));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserChars>>): void {
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

  protected updateForm(userChars: IUserChars): void {
    this.userChars = userChars;
    this.userCharsFormService.resetForm(this.editForm, userChars);
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChannelUserFormService, ChannelUserFormGroup } from './channel-user-form.service';
import { IChannelUser } from '../channel-user.model';
import { ChannelUserService } from '../service/channel-user.service';
import { PrivilegeType } from 'app/entities/enumerations/privilege-type.model';

@Component({
  standalone: true,
  selector: 'jhi-channel-user-update',
  templateUrl: './channel-user-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ChannelUserUpdateComponent implements OnInit {
  isSaving = false;
  channelUser: IChannelUser | null = null;
  privilegeTypeValues = Object.keys(PrivilegeType);

  editForm: ChannelUserFormGroup = this.channelUserFormService.createChannelUserFormGroup();

  constructor(
    protected channelUserService: ChannelUserService,
    protected channelUserFormService: ChannelUserFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ channelUser }) => {
      this.channelUser = channelUser;
      if (channelUser) {
        this.updateForm(channelUser);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const channelUser = this.channelUserFormService.getChannelUser(this.editForm);
    if (channelUser.id !== null) {
      this.subscribeToSaveResponse(this.channelUserService.update(channelUser));
    } else {
      this.subscribeToSaveResponse(this.channelUserService.create(channelUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChannelUser>>): void {
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

  protected updateForm(channelUser: IChannelUser): void {
    this.channelUser = channelUser;
    this.channelUserFormService.resetForm(this.editForm, channelUser);
  }
}

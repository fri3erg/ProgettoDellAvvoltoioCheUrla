import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChannelFormService, ChannelFormGroup } from './channel-form.service';
import { IChannel } from '../channel.model';
import { ChannelService } from '../service/channel.service';
import { ChannelTypes } from 'app/entities/enumerations/channel-types.model';

@Component({
  standalone: true,
  selector: 'jhi-channel-update',
  templateUrl: './channel-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ChannelUpdateComponent implements OnInit {
  isSaving = false;
  channel: IChannel | null = null;
  channelTypesValues = Object.keys(ChannelTypes);

  editForm: ChannelFormGroup = this.channelFormService.createChannelFormGroup();

  constructor(
    protected channelService: ChannelService,
    protected channelFormService: ChannelFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ channel }) => {
      this.channel = channel;
      if (channel) {
        this.updateForm(channel);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const channel = this.channelFormService.getChannel(this.editForm);
    if (channel.id !== null) {
      this.subscribeToSaveResponse(this.channelService.update(channel));
    } else {
      this.subscribeToSaveResponse(this.channelService.create(channel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChannel>>): void {
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

  protected updateForm(channel: IChannel): void {
    this.channel = channel;
    this.channelFormService.resetForm(this.editForm, channel);
  }
}

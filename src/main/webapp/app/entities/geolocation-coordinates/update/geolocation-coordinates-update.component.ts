import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GeolocationCoordinatesFormService, GeolocationCoordinatesFormGroup } from './geolocation-coordinates-form.service';
import { IGeolocationCoordinates } from '../geolocation-coordinates.model';
import { GeolocationCoordinatesService } from '../service/geolocation-coordinates.service';

@Component({
  standalone: true,
  selector: 'jhi-geolocation-coordinates-update',
  templateUrl: './geolocation-coordinates-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GeolocationCoordinatesUpdateComponent implements OnInit {
  isSaving = false;
  geolocationCoordinates: IGeolocationCoordinates | null = null;

  editForm: GeolocationCoordinatesFormGroup = this.geolocationCoordinatesFormService.createGeolocationCoordinatesFormGroup();

  constructor(
    protected geolocationCoordinatesService: GeolocationCoordinatesService,
    protected geolocationCoordinatesFormService: GeolocationCoordinatesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ geolocationCoordinates }) => {
      this.geolocationCoordinates = geolocationCoordinates;
      if (geolocationCoordinates) {
        this.updateForm(geolocationCoordinates);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const geolocationCoordinates = this.geolocationCoordinatesFormService.getGeolocationCoordinates(this.editForm);
    if (geolocationCoordinates.id !== null) {
      this.subscribeToSaveResponse(this.geolocationCoordinatesService.update(geolocationCoordinates));
    } else {
      this.subscribeToSaveResponse(this.geolocationCoordinatesService.create(geolocationCoordinates));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGeolocationCoordinates>>): void {
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

  protected updateForm(geolocationCoordinates: IGeolocationCoordinates): void {
    this.geolocationCoordinates = geolocationCoordinates;
    this.geolocationCoordinatesFormService.resetForm(this.editForm, geolocationCoordinates);
  }
}

import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGeolocationCoordinates, NewGeolocationCoordinates } from '../geolocation-coordinates.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGeolocationCoordinates for edit and NewGeolocationCoordinatesFormGroupInput for create.
 */
type GeolocationCoordinatesFormGroupInput = IGeolocationCoordinates | PartialWithRequiredKeyOf<NewGeolocationCoordinates>;

type GeolocationCoordinatesFormDefaults = Pick<NewGeolocationCoordinates, 'id'>;

type GeolocationCoordinatesFormGroupContent = {
  id: FormControl<IGeolocationCoordinates['id'] | NewGeolocationCoordinates['id']>;
  squealId: FormControl<IGeolocationCoordinates['squealId']>;
  userId: FormControl<IGeolocationCoordinates['userId']>;
  latitude: FormControl<IGeolocationCoordinates['latitude']>;
  longitude: FormControl<IGeolocationCoordinates['longitude']>;
  accuracy: FormControl<IGeolocationCoordinates['accuracy']>;
  heading: FormControl<IGeolocationCoordinates['heading']>;
  speed: FormControl<IGeolocationCoordinates['speed']>;
  timestamp: FormControl<IGeolocationCoordinates['timestamp']>;
};

export type GeolocationCoordinatesFormGroup = FormGroup<GeolocationCoordinatesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GeolocationCoordinatesFormService {
  createGeolocationCoordinatesFormGroup(
    geolocationCoordinates: GeolocationCoordinatesFormGroupInput = { id: null }
  ): GeolocationCoordinatesFormGroup {
    const geolocationCoordinatesRawValue = {
      ...this.getFormDefaults(),
      ...geolocationCoordinates,
    };
    return new FormGroup<GeolocationCoordinatesFormGroupContent>({
      id: new FormControl(
        { value: geolocationCoordinatesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      squealId: new FormControl(geolocationCoordinatesRawValue.squealId),
      userId: new FormControl(geolocationCoordinatesRawValue.userId),
      latitude: new FormControl(geolocationCoordinatesRawValue.latitude),
      longitude: new FormControl(geolocationCoordinatesRawValue.longitude),
      accuracy: new FormControl(geolocationCoordinatesRawValue.accuracy),
      heading: new FormControl(geolocationCoordinatesRawValue.heading),
      speed: new FormControl(geolocationCoordinatesRawValue.speed),
      timestamp: new FormControl(geolocationCoordinatesRawValue.timestamp),
    });
  }

  getGeolocationCoordinates(form: GeolocationCoordinatesFormGroup): IGeolocationCoordinates | NewGeolocationCoordinates {
    return form.getRawValue() as IGeolocationCoordinates | NewGeolocationCoordinates;
  }

  resetForm(form: GeolocationCoordinatesFormGroup, geolocationCoordinates: GeolocationCoordinatesFormGroupInput): void {
    const geolocationCoordinatesRawValue = { ...this.getFormDefaults(), ...geolocationCoordinates };
    form.reset(
      {
        ...geolocationCoordinatesRawValue,
        id: { value: geolocationCoordinatesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GeolocationCoordinatesFormDefaults {
    return {
      id: null,
    };
  }
}

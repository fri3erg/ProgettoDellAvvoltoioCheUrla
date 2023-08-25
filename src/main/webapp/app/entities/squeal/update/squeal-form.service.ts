import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISqueal, NewSqueal } from '../squeal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISqueal for edit and NewSquealFormGroupInput for create.
 */
type SquealFormGroupInput = ISqueal | PartialWithRequiredKeyOf<NewSqueal>;

type SquealFormDefaults = Pick<NewSqueal, 'id'>;

type SquealFormGroupContent = {
  id: FormControl<ISqueal['id'] | NewSqueal['id']>;
  userId: FormControl<ISqueal['userId']>;
  timestamp: FormControl<ISqueal['timestamp']>;
  body: FormControl<ISqueal['body']>;
  img: FormControl<ISqueal['img']>;
  imgContentType: FormControl<ISqueal['imgContentType']>;
  imgName: FormControl<ISqueal['imgName']>;
  videoContentType: FormControl<ISqueal['videoContentType']>;
  videoName: FormControl<ISqueal['videoName']>;
  nCharacters: FormControl<ISqueal['nCharacters']>;
  squealIdResponse: FormControl<ISqueal['squealIdResponse']>;
  refreshTime: FormControl<ISqueal['refreshTime']>;
};

export type SquealFormGroup = FormGroup<SquealFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SquealFormService {
  createSquealFormGroup(squeal: SquealFormGroupInput = { id: null }): SquealFormGroup {
    const squealRawValue = {
      ...this.getFormDefaults(),
      ...squeal,
    };
    return new FormGroup<SquealFormGroupContent>({
      id: new FormControl(
        { value: squealRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(squealRawValue.userId),
      timestamp: new FormControl(squealRawValue.timestamp),
      body: new FormControl(squealRawValue.body),
      img: new FormControl(squealRawValue.img),
      imgContentType: new FormControl(squealRawValue.imgContentType),
      imgName: new FormControl(squealRawValue.imgName),
      videoContentType: new FormControl(squealRawValue.videoContentType),
      videoName: new FormControl(squealRawValue.videoName),
      nCharacters: new FormControl(squealRawValue.nCharacters),
      squealIdResponse: new FormControl(squealRawValue.squealIdResponse),
      refreshTime: new FormControl(squealRawValue.refreshTime),
    });
  }

  getSqueal(form: SquealFormGroup): ISqueal | NewSqueal {
    return form.getRawValue() as ISqueal | NewSqueal;
  }

  resetForm(form: SquealFormGroup, squeal: SquealFormGroupInput): void {
    const squealRawValue = { ...this.getFormDefaults(), ...squeal };
    form.reset(
      {
        ...squealRawValue,
        id: { value: squealRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SquealFormDefaults {
    return {
      id: null,
    };
  }
}

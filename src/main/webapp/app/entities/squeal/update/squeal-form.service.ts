import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISqueal, NewSqueal } from '../squeal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { _id: unknown }> = Partial<Omit<T, '_id'>> & { _id: T['_id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISqueal for edit and NewSquealFormGroupInput for create.
 */
type SquealFormGroupInput = ISqueal | PartialWithRequiredKeyOf<NewSqueal>;

type SquealFormDefaults = Pick<NewSqueal, '_id'>;

type SquealFormGroupContent = {
  id: FormControl<ISqueal['_id'] | NewSqueal['_id']>;
  user_id: FormControl<ISqueal['user_id']>;
  timestamp: FormControl<ISqueal['timestamp']>;
  body: FormControl<ISqueal['body']>;
  img: FormControl<ISqueal['img']>;
  img_content_type: FormControl<ISqueal['img_content_type']>;
  img_name: FormControl<ISqueal['img_name']>;
  video_content_type: FormControl<ISqueal['video_content_type']>;
  video_name: FormControl<ISqueal['video_name']>;
  n_characters: FormControl<ISqueal['n_characters']>;
  squeal_id_response: FormControl<ISqueal['squeal_id_response']>;
  refresh_time: FormControl<ISqueal['refresh_time']>;
};

export type SquealFormGroup = FormGroup<SquealFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SquealFormService {
  createSquealFormGroup(squeal: SquealFormGroupInput = { _id: undefined }): SquealFormGroup {
    const squealRawValue = {
      ...this.getFormDefaults(),
      ...squeal,
    };
    return new FormGroup<SquealFormGroupContent>({
      id: new FormControl(
        { value: squealRawValue._id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user_id: new FormControl(squealRawValue.user_id),
      timestamp: new FormControl(squealRawValue.timestamp),
      body: new FormControl(squealRawValue.body),
      img: new FormControl(squealRawValue.img),
      img_content_type: new FormControl(squealRawValue.img_content_type),
      img_name: new FormControl(squealRawValue.img_name),
      video_content_type: new FormControl(squealRawValue.video_content_type),
      video_name: new FormControl(squealRawValue.video_name),
      n_characters: new FormControl(squealRawValue.n_characters),
      squeal_id_response: new FormControl(squealRawValue.squeal_id_response),
      refresh_time: new FormControl(squealRawValue.refresh_time),
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
        _id: { value: squealRawValue._id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SquealFormDefaults {
    return {
      _id: undefined,
    };
  }
}

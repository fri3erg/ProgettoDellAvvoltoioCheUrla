import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISquealViews, NewSquealViews } from '../squeal-views.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISquealViews for edit and NewSquealViewsFormGroupInput for create.
 */
type SquealViewsFormGroupInput = ISquealViews | PartialWithRequiredKeyOf<NewSquealViews>;

type SquealViewsFormDefaults = Pick<NewSquealViews, 'id'>;

type SquealViewsFormGroupContent = {
  id: FormControl<ISquealViews['id'] | NewSquealViews['id']>;
  squeal_id: FormControl<ISquealViews['squeal_id']>;
  number: FormControl<ISquealViews['number']>;
};

export type SquealViewsFormGroup = FormGroup<SquealViewsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SquealViewsFormService {
  createSquealViewsFormGroup(squealViews: SquealViewsFormGroupInput = { id: null }): SquealViewsFormGroup {
    const squealViewsRawValue = {
      ...this.getFormDefaults(),
      ...squealViews,
    };
    return new FormGroup<SquealViewsFormGroupContent>({
      id: new FormControl(
        { value: squealViewsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      squeal_id: new FormControl(squealViewsRawValue.squeal_id),
      number: new FormControl(squealViewsRawValue.number),
    });
  }

  getSquealViews(form: SquealViewsFormGroup): ISquealViews | NewSquealViews {
    return form.getRawValue() as ISquealViews | NewSquealViews;
  }

  resetForm(form: SquealViewsFormGroup, squealViews: SquealViewsFormGroupInput): void {
    const squealViewsRawValue = { ...this.getFormDefaults(), ...squealViews };
    form.reset(
      {
        ...squealViewsRawValue,
        id: { value: squealViewsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SquealViewsFormDefaults {
    return {
      id: null,
    };
  }
}

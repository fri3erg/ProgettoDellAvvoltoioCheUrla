import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISquealCat, NewSquealCat } from '../squeal-cat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISquealCat for edit and NewSquealCatFormGroupInput for create.
 */
type SquealCatFormGroupInput = ISquealCat | PartialWithRequiredKeyOf<NewSquealCat>;

type SquealCatFormDefaults = Pick<NewSquealCat, 'id'>;

type SquealCatFormGroupContent = {
  id: FormControl<ISquealCat['id'] | NewSquealCat['id']>;
  user_id: FormControl<ISquealCat['user_id']>;
  squeal_id: FormControl<ISquealCat['squeal_id']>;
  category: FormControl<ISquealCat['category']>;
  n_characters: FormControl<ISquealCat['n_characters']>;
  timestamp: FormControl<ISquealCat['timestamp']>;
};

export type SquealCatFormGroup = FormGroup<SquealCatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SquealCatFormService {
  createSquealCatFormGroup(squealCat: SquealCatFormGroupInput = { id: null }): SquealCatFormGroup {
    const squealCatRawValue = {
      ...this.getFormDefaults(),
      ...squealCat,
    };
    return new FormGroup<SquealCatFormGroupContent>({
      id: new FormControl(
        { value: squealCatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user_id: new FormControl(squealCatRawValue.user_id),
      squeal_id: new FormControl(squealCatRawValue.squeal_id),
      category: new FormControl(squealCatRawValue.category),
      n_characters: new FormControl(squealCatRawValue.n_characters),
      timestamp: new FormControl(squealCatRawValue.timestamp),
    });
  }

  getSquealCat(form: SquealCatFormGroup): ISquealCat | NewSquealCat {
    return form.getRawValue() as ISquealCat | NewSquealCat;
  }

  resetForm(form: SquealCatFormGroup, squealCat: SquealCatFormGroupInput): void {
    const squealCatRawValue = { ...this.getFormDefaults(), ...squealCat };
    form.reset(
      {
        ...squealCatRawValue,
        id: { value: squealCatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SquealCatFormDefaults {
    return {
      id: null,
    };
  }
}

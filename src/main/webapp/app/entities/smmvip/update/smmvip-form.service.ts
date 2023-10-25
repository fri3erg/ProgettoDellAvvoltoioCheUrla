import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISMMVIP, NewSMMVIP } from '../smmvip.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISMMVIP for edit and NewSMMVIPFormGroupInput for create.
 */
type SMMVIPFormGroupInput = ISMMVIP | PartialWithRequiredKeyOf<NewSMMVIP>;

type SMMVIPFormDefaults = Pick<NewSMMVIP, 'id'>;

type SMMVIPFormGroupContent = {
  id: FormControl<ISMMVIP['id'] | NewSMMVIP['id']>;
  user_id: FormControl<ISMMVIP['user_id']>;
};

export type SMMVIPFormGroup = FormGroup<SMMVIPFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SMMVIPFormService {
  createSMMVIPFormGroup(sMMVIP: SMMVIPFormGroupInput = { id: null }): SMMVIPFormGroup {
    const sMMVIPRawValue = {
      ...this.getFormDefaults(),
      ...sMMVIP,
    };
    return new FormGroup<SMMVIPFormGroupContent>({
      id: new FormControl(
        { value: sMMVIPRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user_id: new FormControl(sMMVIPRawValue.user_id),
    });
  }

  getSMMVIP(form: SMMVIPFormGroup): ISMMVIP | NewSMMVIP {
    return form.getRawValue() as ISMMVIP | NewSMMVIP;
  }

  resetForm(form: SMMVIPFormGroup, sMMVIP: SMMVIPFormGroupInput): void {
    const sMMVIPRawValue = { ...this.getFormDefaults(), ...sMMVIP };
    form.reset(
      {
        ...sMMVIPRawValue,
        id: { value: sMMVIPRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SMMVIPFormDefaults {
    return {
      id: null,
    };
  }
}

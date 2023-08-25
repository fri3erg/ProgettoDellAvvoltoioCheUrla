import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserChars, NewUserChars } from '../user-chars.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserChars for edit and NewUserCharsFormGroupInput for create.
 */
type UserCharsFormGroupInput = IUserChars | PartialWithRequiredKeyOf<NewUserChars>;

type UserCharsFormDefaults = Pick<NewUserChars, 'id'>;

type UserCharsFormGroupContent = {
  id: FormControl<IUserChars['id'] | NewUserChars['id']>;
  userId: FormControl<IUserChars['userId']>;
  maxChars: FormControl<IUserChars['maxChars']>;
  remaningChars: FormControl<IUserChars['remaningChars']>;
};

export type UserCharsFormGroup = FormGroup<UserCharsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserCharsFormService {
  createUserCharsFormGroup(userChars: UserCharsFormGroupInput = { id: null }): UserCharsFormGroup {
    const userCharsRawValue = {
      ...this.getFormDefaults(),
      ...userChars,
    };
    return new FormGroup<UserCharsFormGroupContent>({
      id: new FormControl(
        { value: userCharsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(userCharsRawValue.userId),
      maxChars: new FormControl(userCharsRawValue.maxChars),
      remaningChars: new FormControl(userCharsRawValue.remaningChars),
    });
  }

  getUserChars(form: UserCharsFormGroup): IUserChars | NewUserChars {
    return form.getRawValue() as IUserChars | NewUserChars;
  }

  resetForm(form: UserCharsFormGroup, userChars: UserCharsFormGroupInput): void {
    const userCharsRawValue = { ...this.getFormDefaults(), ...userChars };
    form.reset(
      {
        ...userCharsRawValue,
        id: { value: userCharsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserCharsFormDefaults {
    return {
      id: null,
    };
  }
}

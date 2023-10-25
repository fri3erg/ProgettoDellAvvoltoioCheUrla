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
  user_id: FormControl<IUserChars['user_id']>;
  max_chars: FormControl<IUserChars['max_chars']>;
  remaning_chars: FormControl<IUserChars['remaning_chars']>;
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
      user_id: new FormControl(userCharsRawValue.user_id),
      max_chars: new FormControl(userCharsRawValue.max_chars),
      remaning_chars: new FormControl(userCharsRawValue.remaning_chars),
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

import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICharactersPurchased, NewCharactersPurchased } from '../characters-purchased.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICharactersPurchased for edit and NewCharactersPurchasedFormGroupInput for create.
 */
type CharactersPurchasedFormGroupInput = ICharactersPurchased | PartialWithRequiredKeyOf<NewCharactersPurchased>;

type CharactersPurchasedFormDefaults = Pick<NewCharactersPurchased, 'id' | 'admin_discount'>;

type CharactersPurchasedFormGroupContent = {
  id: FormControl<ICharactersPurchased['id'] | NewCharactersPurchased['id']>;
  user_id: FormControl<ICharactersPurchased['user_id']>;
  n_characters: FormControl<ICharactersPurchased['n_characters']>;
  timestamp_bought: FormControl<ICharactersPurchased['timestamp_bought']>;
  timestamp_expire: FormControl<ICharactersPurchased['timestamp_expire']>;
  amount: FormControl<ICharactersPurchased['amount']>;
  admin_discount: FormControl<ICharactersPurchased['admin_discount']>;
};

export type CharactersPurchasedFormGroup = FormGroup<CharactersPurchasedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CharactersPurchasedFormService {
  createCharactersPurchasedFormGroup(charactersPurchased: CharactersPurchasedFormGroupInput = { id: null }): CharactersPurchasedFormGroup {
    const charactersPurchasedRawValue = {
      ...this.getFormDefaults(),
      ...charactersPurchased,
    };
    return new FormGroup<CharactersPurchasedFormGroupContent>({
      id: new FormControl(
        { value: charactersPurchasedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user_id: new FormControl(charactersPurchasedRawValue.user_id),
      n_characters: new FormControl(charactersPurchasedRawValue.n_characters),
      timestamp_bought: new FormControl(charactersPurchasedRawValue.timestamp_bought),
      timestamp_expire: new FormControl(charactersPurchasedRawValue.timestamp_expire),
      amount: new FormControl(charactersPurchasedRawValue.amount),
      admin_discount: new FormControl(charactersPurchasedRawValue.admin_discount),
    });
  }

  getCharactersPurchased(form: CharactersPurchasedFormGroup): ICharactersPurchased | NewCharactersPurchased {
    return form.getRawValue() as ICharactersPurchased | NewCharactersPurchased;
  }

  resetForm(form: CharactersPurchasedFormGroup, charactersPurchased: CharactersPurchasedFormGroupInput): void {
    const charactersPurchasedRawValue = { ...this.getFormDefaults(), ...charactersPurchased };
    form.reset(
      {
        ...charactersPurchasedRawValue,
        id: { value: charactersPurchasedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CharactersPurchasedFormDefaults {
    return {
      id: null,
      admin_discount: false,
    };
  }
}

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

type CharactersPurchasedFormDefaults = Pick<NewCharactersPurchased, 'id' | 'adminDiscount'>;

type CharactersPurchasedFormGroupContent = {
  id: FormControl<ICharactersPurchased['id'] | NewCharactersPurchased['id']>;
  userId: FormControl<ICharactersPurchased['userId']>;
  nCharacters: FormControl<ICharactersPurchased['nCharacters']>;
  timestampBought: FormControl<ICharactersPurchased['timestampBought']>;
  timestampExpire: FormControl<ICharactersPurchased['timestampExpire']>;
  amount: FormControl<ICharactersPurchased['amount']>;
  adminDiscount: FormControl<ICharactersPurchased['adminDiscount']>;
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
      userId: new FormControl(charactersPurchasedRawValue.userId),
      nCharacters: new FormControl(charactersPurchasedRawValue.nCharacters),
      timestampBought: new FormControl(charactersPurchasedRawValue.timestampBought),
      timestampExpire: new FormControl(charactersPurchasedRawValue.timestampExpire),
      amount: new FormControl(charactersPurchasedRawValue.amount),
      adminDiscount: new FormControl(charactersPurchasedRawValue.adminDiscount),
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
      adminDiscount: false,
    };
  }
}

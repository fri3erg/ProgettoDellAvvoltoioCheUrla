import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISquealReaction, NewSquealReaction } from '../squeal-reaction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISquealReaction for edit and NewSquealReactionFormGroupInput for create.
 */
type SquealReactionFormGroupInput = ISquealReaction | PartialWithRequiredKeyOf<NewSquealReaction>;

type SquealReactionFormDefaults = Pick<NewSquealReaction, 'id' | 'positive'>;

type SquealReactionFormGroupContent = {
  id: FormControl<ISquealReaction['id'] | NewSquealReaction['id']>;
  userId: FormControl<ISquealReaction['userId']>;
  username: FormControl<ISquealReaction['username']>;
  squealId: FormControl<ISquealReaction['squealId']>;
  positive: FormControl<ISquealReaction['positive']>;
  emoji: FormControl<ISquealReaction['emoji']>;
};

export type SquealReactionFormGroup = FormGroup<SquealReactionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SquealReactionFormService {
  createSquealReactionFormGroup(squealReaction: SquealReactionFormGroupInput = { id: null }): SquealReactionFormGroup {
    const squealReactionRawValue = {
      ...this.getFormDefaults(),
      ...squealReaction,
    };
    return new FormGroup<SquealReactionFormGroupContent>({
      id: new FormControl(
        { value: squealReactionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(squealReactionRawValue.userId),
      username: new FormControl(squealReactionRawValue.username),
      squealId: new FormControl(squealReactionRawValue.squealId),
      positive: new FormControl(squealReactionRawValue.positive),
      emoji: new FormControl(squealReactionRawValue.emoji),
    });
  }

  getSquealReaction(form: SquealReactionFormGroup): ISquealReaction | NewSquealReaction {
    return form.getRawValue() as ISquealReaction | NewSquealReaction;
  }

  resetForm(form: SquealReactionFormGroup, squealReaction: SquealReactionFormGroupInput): void {
    const squealReactionRawValue = { ...this.getFormDefaults(), ...squealReaction };
    form.reset(
      {
        ...squealReactionRawValue,
        id: { value: squealReactionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SquealReactionFormDefaults {
    return {
      id: null,
      positive: false,
    };
  }
}

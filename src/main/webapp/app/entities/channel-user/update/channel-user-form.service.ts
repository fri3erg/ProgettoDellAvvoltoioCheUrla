import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChannelUser, NewChannelUser } from '../channel-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChannelUser for edit and NewChannelUserFormGroupInput for create.
 */
type ChannelUserFormGroupInput = IChannelUser | PartialWithRequiredKeyOf<NewChannelUser>;

type ChannelUserFormDefaults = Pick<NewChannelUser, 'id'>;

type ChannelUserFormGroupContent = {
  id: FormControl<IChannelUser['id'] | NewChannelUser['id']>;
  userId: FormControl<IChannelUser['userId']>;
  channelId: FormControl<IChannelUser['channelId']>;
  privilege: FormControl<IChannelUser['privilege']>;
};

export type ChannelUserFormGroup = FormGroup<ChannelUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChannelUserFormService {
  createChannelUserFormGroup(channelUser: ChannelUserFormGroupInput = { id: null }): ChannelUserFormGroup {
    const channelUserRawValue = {
      ...this.getFormDefaults(),
      ...channelUser,
    };
    return new FormGroup<ChannelUserFormGroupContent>({
      id: new FormControl(
        { value: channelUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(channelUserRawValue.userId),
      channelId: new FormControl(channelUserRawValue.channelId),
      privilege: new FormControl(channelUserRawValue.privilege),
    });
  }

  getChannelUser(form: ChannelUserFormGroup): IChannelUser | NewChannelUser {
    return form.getRawValue() as IChannelUser | NewChannelUser;
  }

  resetForm(form: ChannelUserFormGroup, channelUser: ChannelUserFormGroupInput): void {
    const channelUserRawValue = { ...this.getFormDefaults(), ...channelUser };
    form.reset(
      {
        ...channelUserRawValue,
        id: { value: channelUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChannelUserFormDefaults {
    return {
      id: null,
    };
  }
}

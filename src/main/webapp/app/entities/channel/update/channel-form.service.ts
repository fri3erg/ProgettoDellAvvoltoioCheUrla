import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChannel, NewChannel } from '../channel.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { _id: unknown }> = Partial<Omit<T, 'id'>> & { _id: T['_id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChannel for edit and NewChannelFormGroupInput for create.
 */
type ChannelFormGroupInput = IChannel | PartialWithRequiredKeyOf<NewChannel>;

type ChannelFormDefaults = Pick<NewChannel, '_id' | 'emergency'>;

type ChannelFormGroupContent = {
  id: FormControl<IChannel['_id'] | NewChannel['_id']>;
  name: FormControl<IChannel['name']>;
  type: FormControl<IChannel['type']>;
  mod_type: FormControl<IChannel['mod_type']>;
  emergency: FormControl<IChannel['emergency']>;
};

export type ChannelFormGroup = FormGroup<ChannelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChannelFormService {
  createChannelFormGroup(channel: ChannelFormGroupInput = { _id: null }): ChannelFormGroup {
    const channelRawValue = {
      ...this.getFormDefaults(),
      ...channel,
    };
    return new FormGroup<ChannelFormGroupContent>({
      id: new FormControl(
        { value: channelRawValue._id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(channelRawValue.name),
      type: new FormControl(channelRawValue.type),
      mod_type: new FormControl(channelRawValue.mod_type),
      emergency: new FormControl(channelRawValue.emergency),
    });
  }

  getChannel(form: ChannelFormGroup): IChannel | NewChannel {
    return form.getRawValue() as IChannel | NewChannel;
  }

  resetForm(form: ChannelFormGroup, channel: ChannelFormGroupInput): void {
    const channelRawValue = { ...this.getFormDefaults(), ...channel };
    form.reset(
      {
        ...channelRawValue,
        id: { value: channelRawValue._id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChannelFormDefaults {
    return {
      _id: null,
      emergency: false,
    };
  }
}

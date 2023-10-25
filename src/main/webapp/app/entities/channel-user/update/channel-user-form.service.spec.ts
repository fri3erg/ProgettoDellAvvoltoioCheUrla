import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../channel-user.test-samples';

import { ChannelUserFormService } from './channel-user-form.service';

describe('ChannelUser Form Service', () => {
  let service: ChannelUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelUserFormService);
  });

  describe('Service methods', () => {
    describe('createChannelUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChannelUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            channel_id: expect.any(Object),
            privilege: expect.any(Object),
          })
        );
      });

      it('passing IChannelUser should create a new form with FormGroup', () => {
        const formGroup = service.createChannelUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            channel_id: expect.any(Object),
            privilege: expect.any(Object),
          })
        );
      });
    });

    describe('getChannelUser', () => {
      it('should return NewChannelUser for default ChannelUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChannelUserFormGroup(sampleWithNewData);

        const channelUser = service.getChannelUser(formGroup) as any;

        expect(channelUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewChannelUser for empty ChannelUser initial value', () => {
        const formGroup = service.createChannelUserFormGroup();

        const channelUser = service.getChannelUser(formGroup) as any;

        expect(channelUser).toMatchObject({});
      });

      it('should return IChannelUser', () => {
        const formGroup = service.createChannelUserFormGroup(sampleWithRequiredData);

        const channelUser = service.getChannelUser(formGroup) as any;

        expect(channelUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChannelUser should not enable id FormControl', () => {
        const formGroup = service.createChannelUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChannelUser should disable id FormControl', () => {
        const formGroup = service.createChannelUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../channel.test-samples';

import { ChannelFormService } from './channel-form.service';

describe('Channel Form Service', () => {
  let service: ChannelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelFormService);
  });

  describe('Service methods', () => {
    describe('createChannelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChannelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            mod_type: expect.any(Object),
            emergency: expect.any(Object),
          })
        );
      });

      it('passing IChannel should create a new form with FormGroup', () => {
        const formGroup = service.createChannelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            mod_type: expect.any(Object),
            emergency: expect.any(Object),
          })
        );
      });
    });

    describe('getChannel', () => {
      it('should return NewChannel for default Channel initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChannelFormGroup(sampleWithNewData);

        const channel = service.getChannel(formGroup) as any;

        expect(channel).toMatchObject(sampleWithNewData);
      });

      it('should return NewChannel for empty Channel initial value', () => {
        const formGroup = service.createChannelFormGroup();

        const channel = service.getChannel(formGroup) as any;

        expect(channel).toMatchObject({});
      });

      it('should return IChannel', () => {
        const formGroup = service.createChannelFormGroup(sampleWithRequiredData);

        const channel = service.getChannel(formGroup) as any;

        expect(channel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChannel should not enable id FormControl', () => {
        const formGroup = service.createChannelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChannel should disable id FormControl', () => {
        const formGroup = service.createChannelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

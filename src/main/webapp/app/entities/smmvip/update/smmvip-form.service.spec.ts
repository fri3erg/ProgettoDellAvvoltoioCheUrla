import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../smmvip.test-samples';

import { SMMVIPFormService } from './smmvip-form.service';

describe('SMMVIP Form Service', () => {
  let service: SMMVIPFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SMMVIPFormService);
  });

  describe('Service methods', () => {
    describe('createSMMVIPFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSMMVIPFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
          })
        );
      });

      it('passing ISMMVIP should create a new form with FormGroup', () => {
        const formGroup = service.createSMMVIPFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
          })
        );
      });
    });

    describe('getSMMVIP', () => {
      it('should return NewSMMVIP for default SMMVIP initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSMMVIPFormGroup(sampleWithNewData);

        const sMMVIP = service.getSMMVIP(formGroup) as any;

        expect(sMMVIP).toMatchObject(sampleWithNewData);
      });

      it('should return NewSMMVIP for empty SMMVIP initial value', () => {
        const formGroup = service.createSMMVIPFormGroup();

        const sMMVIP = service.getSMMVIP(formGroup) as any;

        expect(sMMVIP).toMatchObject({});
      });

      it('should return ISMMVIP', () => {
        const formGroup = service.createSMMVIPFormGroup(sampleWithRequiredData);

        const sMMVIP = service.getSMMVIP(formGroup) as any;

        expect(sMMVIP).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISMMVIP should not enable id FormControl', () => {
        const formGroup = service.createSMMVIPFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSMMVIP should disable id FormControl', () => {
        const formGroup = service.createSMMVIPFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

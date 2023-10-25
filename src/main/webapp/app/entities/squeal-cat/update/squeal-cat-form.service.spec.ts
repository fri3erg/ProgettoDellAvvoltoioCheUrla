import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../squeal-cat.test-samples';

import { SquealCatFormService } from './squeal-cat-form.service';

describe('SquealCat Form Service', () => {
  let service: SquealCatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SquealCatFormService);
  });

  describe('Service methods', () => {
    describe('createSquealCatFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSquealCatFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            squeal_id: expect.any(Object),
            category: expect.any(Object),
            n_characters: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });

      it('passing ISquealCat should create a new form with FormGroup', () => {
        const formGroup = service.createSquealCatFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            squeal_id: expect.any(Object),
            category: expect.any(Object),
            n_characters: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });
    });

    describe('getSquealCat', () => {
      it('should return NewSquealCat for default SquealCat initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSquealCatFormGroup(sampleWithNewData);

        const squealCat = service.getSquealCat(formGroup) as any;

        expect(squealCat).toMatchObject(sampleWithNewData);
      });

      it('should return NewSquealCat for empty SquealCat initial value', () => {
        const formGroup = service.createSquealCatFormGroup();

        const squealCat = service.getSquealCat(formGroup) as any;

        expect(squealCat).toMatchObject({});
      });

      it('should return ISquealCat', () => {
        const formGroup = service.createSquealCatFormGroup(sampleWithRequiredData);

        const squealCat = service.getSquealCat(formGroup) as any;

        expect(squealCat).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISquealCat should not enable id FormControl', () => {
        const formGroup = service.createSquealCatFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSquealCat should disable id FormControl', () => {
        const formGroup = service.createSquealCatFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

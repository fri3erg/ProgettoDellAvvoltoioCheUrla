import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../squeal-views.test-samples';

import { SquealViewsFormService } from './squeal-views-form.service';

describe('SquealViews Form Service', () => {
  let service: SquealViewsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SquealViewsFormService);
  });

  describe('Service methods', () => {
    describe('createSquealViewsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSquealViewsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            squealId: expect.any(Object),
            number: expect.any(Object),
          })
        );
      });

      it('passing ISquealViews should create a new form with FormGroup', () => {
        const formGroup = service.createSquealViewsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            squealId: expect.any(Object),
            number: expect.any(Object),
          })
        );
      });
    });

    describe('getSquealViews', () => {
      it('should return NewSquealViews for default SquealViews initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSquealViewsFormGroup(sampleWithNewData);

        const squealViews = service.getSquealViews(formGroup) as any;

        expect(squealViews).toMatchObject(sampleWithNewData);
      });

      it('should return NewSquealViews for empty SquealViews initial value', () => {
        const formGroup = service.createSquealViewsFormGroup();

        const squealViews = service.getSquealViews(formGroup) as any;

        expect(squealViews).toMatchObject({});
      });

      it('should return ISquealViews', () => {
        const formGroup = service.createSquealViewsFormGroup(sampleWithRequiredData);

        const squealViews = service.getSquealViews(formGroup) as any;

        expect(squealViews).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISquealViews should not enable id FormControl', () => {
        const formGroup = service.createSquealViewsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSquealViews should disable id FormControl', () => {
        const formGroup = service.createSquealViewsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

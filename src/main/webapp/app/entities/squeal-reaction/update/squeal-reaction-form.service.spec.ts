import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../squeal-reaction.test-samples';

import { SquealReactionFormService } from './squeal-reaction-form.service';

describe('SquealReaction Form Service', () => {
  let service: SquealReactionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SquealReactionFormService);
  });

  describe('Service methods', () => {
    describe('createSquealReactionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSquealReactionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            username: expect.any(Object),
            squealId: expect.any(Object),
            positive: expect.any(Object),
            emoji: expect.any(Object),
          })
        );
      });

      it('passing ISquealReaction should create a new form with FormGroup', () => {
        const formGroup = service.createSquealReactionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            username: expect.any(Object),
            squealId: expect.any(Object),
            positive: expect.any(Object),
            emoji: expect.any(Object),
          })
        );
      });
    });

    describe('getSquealReaction', () => {
      it('should return NewSquealReaction for default SquealReaction initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSquealReactionFormGroup(sampleWithNewData);

        const squealReaction = service.getSquealReaction(formGroup) as any;

        expect(squealReaction).toMatchObject(sampleWithNewData);
      });

      it('should return NewSquealReaction for empty SquealReaction initial value', () => {
        const formGroup = service.createSquealReactionFormGroup();

        const squealReaction = service.getSquealReaction(formGroup) as any;

        expect(squealReaction).toMatchObject({});
      });

      it('should return ISquealReaction', () => {
        const formGroup = service.createSquealReactionFormGroup(sampleWithRequiredData);

        const squealReaction = service.getSquealReaction(formGroup) as any;

        expect(squealReaction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISquealReaction should not enable id FormControl', () => {
        const formGroup = service.createSquealReactionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSquealReaction should disable id FormControl', () => {
        const formGroup = service.createSquealReactionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

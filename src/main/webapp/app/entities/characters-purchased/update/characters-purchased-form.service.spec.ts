import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../characters-purchased.test-samples';

import { CharactersPurchasedFormService } from './characters-purchased-form.service';

describe('CharactersPurchased Form Service', () => {
  let service: CharactersPurchasedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharactersPurchasedFormService);
  });

  describe('Service methods', () => {
    describe('createCharactersPurchasedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCharactersPurchasedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            n_characters: expect.any(Object),
            timestamp_bought: expect.any(Object),
            timestamp_expire: expect.any(Object),
            amount: expect.any(Object),
            admin_discount: expect.any(Object),
          })
        );
      });

      it('passing ICharactersPurchased should create a new form with FormGroup', () => {
        const formGroup = service.createCharactersPurchasedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            n_characters: expect.any(Object),
            timestamp_bought: expect.any(Object),
            timestamp_expire: expect.any(Object),
            amount: expect.any(Object),
            admin_discount: expect.any(Object),
          })
        );
      });
    });

    describe('getCharactersPurchased', () => {
      it('should return NewCharactersPurchased for default CharactersPurchased initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCharactersPurchasedFormGroup(sampleWithNewData);

        const charactersPurchased = service.getCharactersPurchased(formGroup) as any;

        expect(charactersPurchased).toMatchObject(sampleWithNewData);
      });

      it('should return NewCharactersPurchased for empty CharactersPurchased initial value', () => {
        const formGroup = service.createCharactersPurchasedFormGroup();

        const charactersPurchased = service.getCharactersPurchased(formGroup) as any;

        expect(charactersPurchased).toMatchObject({});
      });

      it('should return ICharactersPurchased', () => {
        const formGroup = service.createCharactersPurchasedFormGroup(sampleWithRequiredData);

        const charactersPurchased = service.getCharactersPurchased(formGroup) as any;

        expect(charactersPurchased).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICharactersPurchased should not enable id FormControl', () => {
        const formGroup = service.createCharactersPurchasedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCharactersPurchased should disable id FormControl', () => {
        const formGroup = service.createCharactersPurchasedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

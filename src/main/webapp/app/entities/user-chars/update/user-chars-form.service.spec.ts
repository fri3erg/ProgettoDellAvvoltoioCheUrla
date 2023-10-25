import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-chars.test-samples';

import { UserCharsFormService } from './user-chars-form.service';

describe('UserChars Form Service', () => {
  let service: UserCharsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCharsFormService);
  });

  describe('Service methods', () => {
    describe('createUserCharsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserCharsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            max_chars: expect.any(Object),
            remaning_chars: expect.any(Object),
          })
        );
      });

      it('passing IUserChars should create a new form with FormGroup', () => {
        const formGroup = service.createUserCharsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user_id: expect.any(Object),
            max_chars: expect.any(Object),
            remaning_chars: expect.any(Object),
          })
        );
      });
    });

    describe('getUserChars', () => {
      it('should return NewUserChars for default UserChars initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserCharsFormGroup(sampleWithNewData);

        const userChars = service.getUserChars(formGroup) as any;

        expect(userChars).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserChars for empty UserChars initial value', () => {
        const formGroup = service.createUserCharsFormGroup();

        const userChars = service.getUserChars(formGroup) as any;

        expect(userChars).toMatchObject({});
      });

      it('should return IUserChars', () => {
        const formGroup = service.createUserCharsFormGroup(sampleWithRequiredData);

        const userChars = service.getUserChars(formGroup) as any;

        expect(userChars).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserChars should not enable id FormControl', () => {
        const formGroup = service.createUserCharsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserChars should disable id FormControl', () => {
        const formGroup = service.createUserCharsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

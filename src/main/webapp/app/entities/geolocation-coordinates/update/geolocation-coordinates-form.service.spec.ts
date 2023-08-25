import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../geolocation-coordinates.test-samples';

import { GeolocationCoordinatesFormService } from './geolocation-coordinates-form.service';

describe('GeolocationCoordinates Form Service', () => {
  let service: GeolocationCoordinatesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationCoordinatesFormService);
  });

  describe('Service methods', () => {
    describe('createGeolocationCoordinatesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGeolocationCoordinatesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            squealId: expect.any(Object),
            userId: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
            accuracy: expect.any(Object),
            heading: expect.any(Object),
            speed: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });

      it('passing IGeolocationCoordinates should create a new form with FormGroup', () => {
        const formGroup = service.createGeolocationCoordinatesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            squealId: expect.any(Object),
            userId: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
            accuracy: expect.any(Object),
            heading: expect.any(Object),
            speed: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });
    });

    describe('getGeolocationCoordinates', () => {
      it('should return NewGeolocationCoordinates for default GeolocationCoordinates initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGeolocationCoordinatesFormGroup(sampleWithNewData);

        const geolocationCoordinates = service.getGeolocationCoordinates(formGroup) as any;

        expect(geolocationCoordinates).toMatchObject(sampleWithNewData);
      });

      it('should return NewGeolocationCoordinates for empty GeolocationCoordinates initial value', () => {
        const formGroup = service.createGeolocationCoordinatesFormGroup();

        const geolocationCoordinates = service.getGeolocationCoordinates(formGroup) as any;

        expect(geolocationCoordinates).toMatchObject({});
      });

      it('should return IGeolocationCoordinates', () => {
        const formGroup = service.createGeolocationCoordinatesFormGroup(sampleWithRequiredData);

        const geolocationCoordinates = service.getGeolocationCoordinates(formGroup) as any;

        expect(geolocationCoordinates).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGeolocationCoordinates should not enable id FormControl', () => {
        const formGroup = service.createGeolocationCoordinatesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGeolocationCoordinates should disable id FormControl', () => {
        const formGroup = service.createGeolocationCoordinatesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

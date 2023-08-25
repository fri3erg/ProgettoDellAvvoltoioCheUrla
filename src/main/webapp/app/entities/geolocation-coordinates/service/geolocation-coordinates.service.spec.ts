import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGeolocationCoordinates } from '../geolocation-coordinates.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../geolocation-coordinates.test-samples';

import { GeolocationCoordinatesService } from './geolocation-coordinates.service';

const requireRestSample: IGeolocationCoordinates = {
  ...sampleWithRequiredData,
};

describe('GeolocationCoordinates Service', () => {
  let service: GeolocationCoordinatesService;
  let httpMock: HttpTestingController;
  let expectedResult: IGeolocationCoordinates | IGeolocationCoordinates[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GeolocationCoordinatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a GeolocationCoordinates', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const geolocationCoordinates = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(geolocationCoordinates).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GeolocationCoordinates', () => {
      const geolocationCoordinates = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(geolocationCoordinates).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GeolocationCoordinates', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GeolocationCoordinates', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GeolocationCoordinates', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGeolocationCoordinatesToCollectionIfMissing', () => {
      it('should add a GeolocationCoordinates to an empty array', () => {
        const geolocationCoordinates: IGeolocationCoordinates = sampleWithRequiredData;
        expectedResult = service.addGeolocationCoordinatesToCollectionIfMissing([], geolocationCoordinates);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(geolocationCoordinates);
      });

      it('should not add a GeolocationCoordinates to an array that contains it', () => {
        const geolocationCoordinates: IGeolocationCoordinates = sampleWithRequiredData;
        const geolocationCoordinatesCollection: IGeolocationCoordinates[] = [
          {
            ...geolocationCoordinates,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGeolocationCoordinatesToCollectionIfMissing(geolocationCoordinatesCollection, geolocationCoordinates);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GeolocationCoordinates to an array that doesn't contain it", () => {
        const geolocationCoordinates: IGeolocationCoordinates = sampleWithRequiredData;
        const geolocationCoordinatesCollection: IGeolocationCoordinates[] = [sampleWithPartialData];
        expectedResult = service.addGeolocationCoordinatesToCollectionIfMissing(geolocationCoordinatesCollection, geolocationCoordinates);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(geolocationCoordinates);
      });

      it('should add only unique GeolocationCoordinates to an array', () => {
        const geolocationCoordinatesArray: IGeolocationCoordinates[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const geolocationCoordinatesCollection: IGeolocationCoordinates[] = [sampleWithRequiredData];
        expectedResult = service.addGeolocationCoordinatesToCollectionIfMissing(
          geolocationCoordinatesCollection,
          ...geolocationCoordinatesArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const geolocationCoordinates: IGeolocationCoordinates = sampleWithRequiredData;
        const geolocationCoordinates2: IGeolocationCoordinates = sampleWithPartialData;
        expectedResult = service.addGeolocationCoordinatesToCollectionIfMissing([], geolocationCoordinates, geolocationCoordinates2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(geolocationCoordinates);
        expect(expectedResult).toContain(geolocationCoordinates2);
      });

      it('should accept null and undefined values', () => {
        const geolocationCoordinates: IGeolocationCoordinates = sampleWithRequiredData;
        expectedResult = service.addGeolocationCoordinatesToCollectionIfMissing([], null, geolocationCoordinates, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(geolocationCoordinates);
      });

      it('should return initial array if no GeolocationCoordinates is added', () => {
        const geolocationCoordinatesCollection: IGeolocationCoordinates[] = [sampleWithRequiredData];
        expectedResult = service.addGeolocationCoordinatesToCollectionIfMissing(geolocationCoordinatesCollection, undefined, null);
        expect(expectedResult).toEqual(geolocationCoordinatesCollection);
      });
    });

    describe('compareGeolocationCoordinates', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGeolocationCoordinates(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareGeolocationCoordinates(entity1, entity2);
        const compareResult2 = service.compareGeolocationCoordinates(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareGeolocationCoordinates(entity1, entity2);
        const compareResult2 = service.compareGeolocationCoordinates(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareGeolocationCoordinates(entity1, entity2);
        const compareResult2 = service.compareGeolocationCoordinates(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

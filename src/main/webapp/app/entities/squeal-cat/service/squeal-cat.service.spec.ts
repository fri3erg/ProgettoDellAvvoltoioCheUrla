import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISquealCat } from '../squeal-cat.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../squeal-cat.test-samples';

import { SquealCatService } from './squeal-cat.service';

const requireRestSample: ISquealCat = {
  ...sampleWithRequiredData,
};

describe('SquealCat Service', () => {
  let service: SquealCatService;
  let httpMock: HttpTestingController;
  let expectedResult: ISquealCat | ISquealCat[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SquealCatService);
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

    it('should create a SquealCat', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const squealCat = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(squealCat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SquealCat', () => {
      const squealCat = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(squealCat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SquealCat', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SquealCat', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SquealCat', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSquealCatToCollectionIfMissing', () => {
      it('should add a SquealCat to an empty array', () => {
        const squealCat: ISquealCat = sampleWithRequiredData;
        expectedResult = service.addSquealCatToCollectionIfMissing([], squealCat);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squealCat);
      });

      it('should not add a SquealCat to an array that contains it', () => {
        const squealCat: ISquealCat = sampleWithRequiredData;
        const squealCatCollection: ISquealCat[] = [
          {
            ...squealCat,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSquealCatToCollectionIfMissing(squealCatCollection, squealCat);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SquealCat to an array that doesn't contain it", () => {
        const squealCat: ISquealCat = sampleWithRequiredData;
        const squealCatCollection: ISquealCat[] = [sampleWithPartialData];
        expectedResult = service.addSquealCatToCollectionIfMissing(squealCatCollection, squealCat);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squealCat);
      });

      it('should add only unique SquealCat to an array', () => {
        const squealCatArray: ISquealCat[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const squealCatCollection: ISquealCat[] = [sampleWithRequiredData];
        expectedResult = service.addSquealCatToCollectionIfMissing(squealCatCollection, ...squealCatArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const squealCat: ISquealCat = sampleWithRequiredData;
        const squealCat2: ISquealCat = sampleWithPartialData;
        expectedResult = service.addSquealCatToCollectionIfMissing([], squealCat, squealCat2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squealCat);
        expect(expectedResult).toContain(squealCat2);
      });

      it('should accept null and undefined values', () => {
        const squealCat: ISquealCat = sampleWithRequiredData;
        expectedResult = service.addSquealCatToCollectionIfMissing([], null, squealCat, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squealCat);
      });

      it('should return initial array if no SquealCat is added', () => {
        const squealCatCollection: ISquealCat[] = [sampleWithRequiredData];
        expectedResult = service.addSquealCatToCollectionIfMissing(squealCatCollection, undefined, null);
        expect(expectedResult).toEqual(squealCatCollection);
      });
    });

    describe('compareSquealCat', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSquealCat(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareSquealCat(entity1, entity2);
        const compareResult2 = service.compareSquealCat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareSquealCat(entity1, entity2);
        const compareResult2 = service.compareSquealCat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareSquealCat(entity1, entity2);
        const compareResult2 = service.compareSquealCat(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

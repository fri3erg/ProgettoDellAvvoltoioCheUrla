import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISqueal } from '../squeal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../squeal.test-samples';

import { SquealService } from './squeal.service';

const requireRestSample: ISqueal = {
  ...sampleWithRequiredData,
};

describe('Squeal Service', () => {
  let service: SquealService;
  let httpMock: HttpTestingController;
  let expectedResult: ISqueal | ISqueal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SquealService);
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

    it('should create a Squeal', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const squeal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(squeal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Squeal', () => {
      const squeal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(squeal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Squeal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Squeal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Squeal', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSquealToCollectionIfMissing', () => {
      it('should add a Squeal to an empty array', () => {
        const squeal: ISqueal = sampleWithRequiredData;
        expectedResult = service.addSquealToCollectionIfMissing([], squeal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squeal);
      });

      it('should not add a Squeal to an array that contains it', () => {
        const squeal: ISqueal = sampleWithRequiredData;
        const squealCollection: ISqueal[] = [
          {
            ...squeal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSquealToCollectionIfMissing(squealCollection, squeal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Squeal to an array that doesn't contain it", () => {
        const squeal: ISqueal = sampleWithRequiredData;
        const squealCollection: ISqueal[] = [sampleWithPartialData];
        expectedResult = service.addSquealToCollectionIfMissing(squealCollection, squeal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squeal);
      });

      it('should add only unique Squeal to an array', () => {
        const squealArray: ISqueal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const squealCollection: ISqueal[] = [sampleWithRequiredData];
        expectedResult = service.addSquealToCollectionIfMissing(squealCollection, ...squealArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const squeal: ISqueal = sampleWithRequiredData;
        const squeal2: ISqueal = sampleWithPartialData;
        expectedResult = service.addSquealToCollectionIfMissing([], squeal, squeal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squeal);
        expect(expectedResult).toContain(squeal2);
      });

      it('should accept null and undefined values', () => {
        const squeal: ISqueal = sampleWithRequiredData;
        expectedResult = service.addSquealToCollectionIfMissing([], null, squeal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squeal);
      });

      it('should return initial array if no Squeal is added', () => {
        const squealCollection: ISqueal[] = [sampleWithRequiredData];
        expectedResult = service.addSquealToCollectionIfMissing(squealCollection, undefined, null);
        expect(expectedResult).toEqual(squealCollection);
      });
    });

    describe('compareSqueal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSqueal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareSqueal(entity1, entity2);
        const compareResult2 = service.compareSqueal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareSqueal(entity1, entity2);
        const compareResult2 = service.compareSqueal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareSqueal(entity1, entity2);
        const compareResult2 = service.compareSqueal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISquealViews } from '../squeal-views.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../squeal-views.test-samples';

import { SquealViewsService } from './squeal-views.service';

const requireRestSample: ISquealViews = {
  ...sampleWithRequiredData,
};

describe('SquealViews Service', () => {
  let service: SquealViewsService;
  let httpMock: HttpTestingController;
  let expectedResult: ISquealViews | ISquealViews[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SquealViewsService);
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

    it('should create a SquealViews', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const squealViews = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(squealViews).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SquealViews', () => {
      const squealViews = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(squealViews).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SquealViews', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SquealViews', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SquealViews', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSquealViewsToCollectionIfMissing', () => {
      it('should add a SquealViews to an empty array', () => {
        const squealViews: ISquealViews = sampleWithRequiredData;
        expectedResult = service.addSquealViewsToCollectionIfMissing([], squealViews);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squealViews);
      });

      it('should not add a SquealViews to an array that contains it', () => {
        const squealViews: ISquealViews = sampleWithRequiredData;
        const squealViewsCollection: ISquealViews[] = [
          {
            ...squealViews,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSquealViewsToCollectionIfMissing(squealViewsCollection, squealViews);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SquealViews to an array that doesn't contain it", () => {
        const squealViews: ISquealViews = sampleWithRequiredData;
        const squealViewsCollection: ISquealViews[] = [sampleWithPartialData];
        expectedResult = service.addSquealViewsToCollectionIfMissing(squealViewsCollection, squealViews);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squealViews);
      });

      it('should add only unique SquealViews to an array', () => {
        const squealViewsArray: ISquealViews[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const squealViewsCollection: ISquealViews[] = [sampleWithRequiredData];
        expectedResult = service.addSquealViewsToCollectionIfMissing(squealViewsCollection, ...squealViewsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const squealViews: ISquealViews = sampleWithRequiredData;
        const squealViews2: ISquealViews = sampleWithPartialData;
        expectedResult = service.addSquealViewsToCollectionIfMissing([], squealViews, squealViews2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squealViews);
        expect(expectedResult).toContain(squealViews2);
      });

      it('should accept null and undefined values', () => {
        const squealViews: ISquealViews = sampleWithRequiredData;
        expectedResult = service.addSquealViewsToCollectionIfMissing([], null, squealViews, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squealViews);
      });

      it('should return initial array if no SquealViews is added', () => {
        const squealViewsCollection: ISquealViews[] = [sampleWithRequiredData];
        expectedResult = service.addSquealViewsToCollectionIfMissing(squealViewsCollection, undefined, null);
        expect(expectedResult).toEqual(squealViewsCollection);
      });
    });

    describe('compareSquealViews', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSquealViews(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareSquealViews(entity1, entity2);
        const compareResult2 = service.compareSquealViews(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareSquealViews(entity1, entity2);
        const compareResult2 = service.compareSquealViews(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareSquealViews(entity1, entity2);
        const compareResult2 = service.compareSquealViews(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

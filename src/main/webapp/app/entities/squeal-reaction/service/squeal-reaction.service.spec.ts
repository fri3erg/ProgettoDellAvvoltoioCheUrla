import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISquealReaction } from '../squeal-reaction.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../squeal-reaction.test-samples';

import { SquealReactionService } from './squeal-reaction.service';

const requireRestSample: ISquealReaction = {
  ...sampleWithRequiredData,
};

describe('SquealReaction Service', () => {
  let service: SquealReactionService;
  let httpMock: HttpTestingController;
  let expectedResult: ISquealReaction | ISquealReaction[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SquealReactionService);
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

    it('should create a SquealReaction', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const squealReaction = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(squealReaction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SquealReaction', () => {
      const squealReaction = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(squealReaction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SquealReaction', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SquealReaction', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SquealReaction', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSquealReactionToCollectionIfMissing', () => {
      it('should add a SquealReaction to an empty array', () => {
        const squealReaction: ISquealReaction = sampleWithRequiredData;
        expectedResult = service.addSquealReactionToCollectionIfMissing([], squealReaction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squealReaction);
      });

      it('should not add a SquealReaction to an array that contains it', () => {
        const squealReaction: ISquealReaction = sampleWithRequiredData;
        const squealReactionCollection: ISquealReaction[] = [
          {
            ...squealReaction,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSquealReactionToCollectionIfMissing(squealReactionCollection, squealReaction);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SquealReaction to an array that doesn't contain it", () => {
        const squealReaction: ISquealReaction = sampleWithRequiredData;
        const squealReactionCollection: ISquealReaction[] = [sampleWithPartialData];
        expectedResult = service.addSquealReactionToCollectionIfMissing(squealReactionCollection, squealReaction);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squealReaction);
      });

      it('should add only unique SquealReaction to an array', () => {
        const squealReactionArray: ISquealReaction[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const squealReactionCollection: ISquealReaction[] = [sampleWithRequiredData];
        expectedResult = service.addSquealReactionToCollectionIfMissing(squealReactionCollection, ...squealReactionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const squealReaction: ISquealReaction = sampleWithRequiredData;
        const squealReaction2: ISquealReaction = sampleWithPartialData;
        expectedResult = service.addSquealReactionToCollectionIfMissing([], squealReaction, squealReaction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(squealReaction);
        expect(expectedResult).toContain(squealReaction2);
      });

      it('should accept null and undefined values', () => {
        const squealReaction: ISquealReaction = sampleWithRequiredData;
        expectedResult = service.addSquealReactionToCollectionIfMissing([], null, squealReaction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(squealReaction);
      });

      it('should return initial array if no SquealReaction is added', () => {
        const squealReactionCollection: ISquealReaction[] = [sampleWithRequiredData];
        expectedResult = service.addSquealReactionToCollectionIfMissing(squealReactionCollection, undefined, null);
        expect(expectedResult).toEqual(squealReactionCollection);
      });
    });

    describe('compareSquealReaction', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSquealReaction(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareSquealReaction(entity1, entity2);
        const compareResult2 = service.compareSquealReaction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareSquealReaction(entity1, entity2);
        const compareResult2 = service.compareSquealReaction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareSquealReaction(entity1, entity2);
        const compareResult2 = service.compareSquealReaction(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

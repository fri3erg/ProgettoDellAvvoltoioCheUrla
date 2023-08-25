import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISMMVIP } from '../smmvip.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../smmvip.test-samples';

import { SMMVIPService } from './smmvip.service';

const requireRestSample: ISMMVIP = {
  ...sampleWithRequiredData,
};

describe('SMMVIP Service', () => {
  let service: SMMVIPService;
  let httpMock: HttpTestingController;
  let expectedResult: ISMMVIP | ISMMVIP[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SMMVIPService);
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

    it('should create a SMMVIP', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sMMVIP = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sMMVIP).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SMMVIP', () => {
      const sMMVIP = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sMMVIP).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SMMVIP', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SMMVIP', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SMMVIP', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSMMVIPToCollectionIfMissing', () => {
      it('should add a SMMVIP to an empty array', () => {
        const sMMVIP: ISMMVIP = sampleWithRequiredData;
        expectedResult = service.addSMMVIPToCollectionIfMissing([], sMMVIP);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sMMVIP);
      });

      it('should not add a SMMVIP to an array that contains it', () => {
        const sMMVIP: ISMMVIP = sampleWithRequiredData;
        const sMMVIPCollection: ISMMVIP[] = [
          {
            ...sMMVIP,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSMMVIPToCollectionIfMissing(sMMVIPCollection, sMMVIP);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SMMVIP to an array that doesn't contain it", () => {
        const sMMVIP: ISMMVIP = sampleWithRequiredData;
        const sMMVIPCollection: ISMMVIP[] = [sampleWithPartialData];
        expectedResult = service.addSMMVIPToCollectionIfMissing(sMMVIPCollection, sMMVIP);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sMMVIP);
      });

      it('should add only unique SMMVIP to an array', () => {
        const sMMVIPArray: ISMMVIP[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sMMVIPCollection: ISMMVIP[] = [sampleWithRequiredData];
        expectedResult = service.addSMMVIPToCollectionIfMissing(sMMVIPCollection, ...sMMVIPArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sMMVIP: ISMMVIP = sampleWithRequiredData;
        const sMMVIP2: ISMMVIP = sampleWithPartialData;
        expectedResult = service.addSMMVIPToCollectionIfMissing([], sMMVIP, sMMVIP2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sMMVIP);
        expect(expectedResult).toContain(sMMVIP2);
      });

      it('should accept null and undefined values', () => {
        const sMMVIP: ISMMVIP = sampleWithRequiredData;
        expectedResult = service.addSMMVIPToCollectionIfMissing([], null, sMMVIP, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sMMVIP);
      });

      it('should return initial array if no SMMVIP is added', () => {
        const sMMVIPCollection: ISMMVIP[] = [sampleWithRequiredData];
        expectedResult = service.addSMMVIPToCollectionIfMissing(sMMVIPCollection, undefined, null);
        expect(expectedResult).toEqual(sMMVIPCollection);
      });
    });

    describe('compareSMMVIP', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSMMVIP(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareSMMVIP(entity1, entity2);
        const compareResult2 = service.compareSMMVIP(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareSMMVIP(entity1, entity2);
        const compareResult2 = service.compareSMMVIP(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareSMMVIP(entity1, entity2);
        const compareResult2 = service.compareSMMVIP(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

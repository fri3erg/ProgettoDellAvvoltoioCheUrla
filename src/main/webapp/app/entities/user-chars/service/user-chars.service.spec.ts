import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserChars } from '../user-chars.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-chars.test-samples';

import { UserCharsService } from './user-chars.service';

const requireRestSample: IUserChars = {
  ...sampleWithRequiredData,
};

describe('UserChars Service', () => {
  let service: UserCharsService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserChars | IUserChars[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserCharsService);
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

    it('should create a UserChars', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userChars = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userChars).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserChars', () => {
      const userChars = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userChars).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserChars', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserChars', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserChars', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserCharsToCollectionIfMissing', () => {
      it('should add a UserChars to an empty array', () => {
        const userChars: IUserChars = sampleWithRequiredData;
        expectedResult = service.addUserCharsToCollectionIfMissing([], userChars);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userChars);
      });

      it('should not add a UserChars to an array that contains it', () => {
        const userChars: IUserChars = sampleWithRequiredData;
        const userCharsCollection: IUserChars[] = [
          {
            ...userChars,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserCharsToCollectionIfMissing(userCharsCollection, userChars);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserChars to an array that doesn't contain it", () => {
        const userChars: IUserChars = sampleWithRequiredData;
        const userCharsCollection: IUserChars[] = [sampleWithPartialData];
        expectedResult = service.addUserCharsToCollectionIfMissing(userCharsCollection, userChars);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userChars);
      });

      it('should add only unique UserChars to an array', () => {
        const userCharsArray: IUserChars[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userCharsCollection: IUserChars[] = [sampleWithRequiredData];
        expectedResult = service.addUserCharsToCollectionIfMissing(userCharsCollection, ...userCharsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userChars: IUserChars = sampleWithRequiredData;
        const userChars2: IUserChars = sampleWithPartialData;
        expectedResult = service.addUserCharsToCollectionIfMissing([], userChars, userChars2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userChars);
        expect(expectedResult).toContain(userChars2);
      });

      it('should accept null and undefined values', () => {
        const userChars: IUserChars = sampleWithRequiredData;
        expectedResult = service.addUserCharsToCollectionIfMissing([], null, userChars, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userChars);
      });

      it('should return initial array if no UserChars is added', () => {
        const userCharsCollection: IUserChars[] = [sampleWithRequiredData];
        expectedResult = service.addUserCharsToCollectionIfMissing(userCharsCollection, undefined, null);
        expect(expectedResult).toEqual(userCharsCollection);
      });
    });

    describe('compareUserChars', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserChars(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareUserChars(entity1, entity2);
        const compareResult2 = service.compareUserChars(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareUserChars(entity1, entity2);
        const compareResult2 = service.compareUserChars(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareUserChars(entity1, entity2);
        const compareResult2 = service.compareUserChars(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICharactersPurchased } from '../characters-purchased.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../characters-purchased.test-samples';

import { CharactersPurchasedService } from './characters-purchased.service';

const requireRestSample: ICharactersPurchased = {
  ...sampleWithRequiredData,
};

describe('CharactersPurchased Service', () => {
  let service: CharactersPurchasedService;
  let httpMock: HttpTestingController;
  let expectedResult: ICharactersPurchased | ICharactersPurchased[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CharactersPurchasedService);
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

    it('should create a CharactersPurchased', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const charactersPurchased = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(charactersPurchased).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CharactersPurchased', () => {
      const charactersPurchased = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(charactersPurchased).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CharactersPurchased', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CharactersPurchased', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CharactersPurchased', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCharactersPurchasedToCollectionIfMissing', () => {
      it('should add a CharactersPurchased to an empty array', () => {
        const charactersPurchased: ICharactersPurchased = sampleWithRequiredData;
        expectedResult = service.addCharactersPurchasedToCollectionIfMissing([], charactersPurchased);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charactersPurchased);
      });

      it('should not add a CharactersPurchased to an array that contains it', () => {
        const charactersPurchased: ICharactersPurchased = sampleWithRequiredData;
        const charactersPurchasedCollection: ICharactersPurchased[] = [
          {
            ...charactersPurchased,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCharactersPurchasedToCollectionIfMissing(charactersPurchasedCollection, charactersPurchased);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CharactersPurchased to an array that doesn't contain it", () => {
        const charactersPurchased: ICharactersPurchased = sampleWithRequiredData;
        const charactersPurchasedCollection: ICharactersPurchased[] = [sampleWithPartialData];
        expectedResult = service.addCharactersPurchasedToCollectionIfMissing(charactersPurchasedCollection, charactersPurchased);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charactersPurchased);
      });

      it('should add only unique CharactersPurchased to an array', () => {
        const charactersPurchasedArray: ICharactersPurchased[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const charactersPurchasedCollection: ICharactersPurchased[] = [sampleWithRequiredData];
        expectedResult = service.addCharactersPurchasedToCollectionIfMissing(charactersPurchasedCollection, ...charactersPurchasedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const charactersPurchased: ICharactersPurchased = sampleWithRequiredData;
        const charactersPurchased2: ICharactersPurchased = sampleWithPartialData;
        expectedResult = service.addCharactersPurchasedToCollectionIfMissing([], charactersPurchased, charactersPurchased2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charactersPurchased);
        expect(expectedResult).toContain(charactersPurchased2);
      });

      it('should accept null and undefined values', () => {
        const charactersPurchased: ICharactersPurchased = sampleWithRequiredData;
        expectedResult = service.addCharactersPurchasedToCollectionIfMissing([], null, charactersPurchased, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charactersPurchased);
      });

      it('should return initial array if no CharactersPurchased is added', () => {
        const charactersPurchasedCollection: ICharactersPurchased[] = [sampleWithRequiredData];
        expectedResult = service.addCharactersPurchasedToCollectionIfMissing(charactersPurchasedCollection, undefined, null);
        expect(expectedResult).toEqual(charactersPurchasedCollection);
      });
    });

    describe('compareCharactersPurchased', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCharactersPurchased(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareCharactersPurchased(entity1, entity2);
        const compareResult2 = service.compareCharactersPurchased(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareCharactersPurchased(entity1, entity2);
        const compareResult2 = service.compareCharactersPurchased(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareCharactersPurchased(entity1, entity2);
        const compareResult2 = service.compareCharactersPurchased(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

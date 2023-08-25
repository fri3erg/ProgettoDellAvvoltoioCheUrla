import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChannelUser } from '../channel-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../channel-user.test-samples';

import { ChannelUserService } from './channel-user.service';

const requireRestSample: IChannelUser = {
  ...sampleWithRequiredData,
};

describe('ChannelUser Service', () => {
  let service: ChannelUserService;
  let httpMock: HttpTestingController;
  let expectedResult: IChannelUser | IChannelUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChannelUserService);
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

    it('should create a ChannelUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const channelUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(channelUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ChannelUser', () => {
      const channelUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(channelUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ChannelUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ChannelUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ChannelUser', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChannelUserToCollectionIfMissing', () => {
      it('should add a ChannelUser to an empty array', () => {
        const channelUser: IChannelUser = sampleWithRequiredData;
        expectedResult = service.addChannelUserToCollectionIfMissing([], channelUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(channelUser);
      });

      it('should not add a ChannelUser to an array that contains it', () => {
        const channelUser: IChannelUser = sampleWithRequiredData;
        const channelUserCollection: IChannelUser[] = [
          {
            ...channelUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChannelUserToCollectionIfMissing(channelUserCollection, channelUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ChannelUser to an array that doesn't contain it", () => {
        const channelUser: IChannelUser = sampleWithRequiredData;
        const channelUserCollection: IChannelUser[] = [sampleWithPartialData];
        expectedResult = service.addChannelUserToCollectionIfMissing(channelUserCollection, channelUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(channelUser);
      });

      it('should add only unique ChannelUser to an array', () => {
        const channelUserArray: IChannelUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const channelUserCollection: IChannelUser[] = [sampleWithRequiredData];
        expectedResult = service.addChannelUserToCollectionIfMissing(channelUserCollection, ...channelUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const channelUser: IChannelUser = sampleWithRequiredData;
        const channelUser2: IChannelUser = sampleWithPartialData;
        expectedResult = service.addChannelUserToCollectionIfMissing([], channelUser, channelUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(channelUser);
        expect(expectedResult).toContain(channelUser2);
      });

      it('should accept null and undefined values', () => {
        const channelUser: IChannelUser = sampleWithRequiredData;
        expectedResult = service.addChannelUserToCollectionIfMissing([], null, channelUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(channelUser);
      });

      it('should return initial array if no ChannelUser is added', () => {
        const channelUserCollection: IChannelUser[] = [sampleWithRequiredData];
        expectedResult = service.addChannelUserToCollectionIfMissing(channelUserCollection, undefined, null);
        expect(expectedResult).toEqual(channelUserCollection);
      });
    });

    describe('compareChannelUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChannelUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareChannelUser(entity1, entity2);
        const compareResult2 = service.compareChannelUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareChannelUser(entity1, entity2);
        const compareResult2 = service.compareChannelUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareChannelUser(entity1, entity2);
        const compareResult2 = service.compareChannelUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

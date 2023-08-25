import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChannel } from '../channel.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../channel.test-samples';

import { ChannelService } from './channel.service';

const requireRestSample: IChannel = {
  ...sampleWithRequiredData,
};

describe('Channel Service', () => {
  let service: ChannelService;
  let httpMock: HttpTestingController;
  let expectedResult: IChannel | IChannel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChannelService);
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

    it('should create a Channel', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const channel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(channel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Channel', () => {
      const channel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(channel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Channel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Channel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Channel', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChannelToCollectionIfMissing', () => {
      it('should add a Channel to an empty array', () => {
        const channel: IChannel = sampleWithRequiredData;
        expectedResult = service.addChannelToCollectionIfMissing([], channel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(channel);
      });

      it('should not add a Channel to an array that contains it', () => {
        const channel: IChannel = sampleWithRequiredData;
        const channelCollection: IChannel[] = [
          {
            ...channel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChannelToCollectionIfMissing(channelCollection, channel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Channel to an array that doesn't contain it", () => {
        const channel: IChannel = sampleWithRequiredData;
        const channelCollection: IChannel[] = [sampleWithPartialData];
        expectedResult = service.addChannelToCollectionIfMissing(channelCollection, channel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(channel);
      });

      it('should add only unique Channel to an array', () => {
        const channelArray: IChannel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const channelCollection: IChannel[] = [sampleWithRequiredData];
        expectedResult = service.addChannelToCollectionIfMissing(channelCollection, ...channelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const channel: IChannel = sampleWithRequiredData;
        const channel2: IChannel = sampleWithPartialData;
        expectedResult = service.addChannelToCollectionIfMissing([], channel, channel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(channel);
        expect(expectedResult).toContain(channel2);
      });

      it('should accept null and undefined values', () => {
        const channel: IChannel = sampleWithRequiredData;
        expectedResult = service.addChannelToCollectionIfMissing([], null, channel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(channel);
      });

      it('should return initial array if no Channel is added', () => {
        const channelCollection: IChannel[] = [sampleWithRequiredData];
        expectedResult = service.addChannelToCollectionIfMissing(channelCollection, undefined, null);
        expect(expectedResult).toEqual(channelCollection);
      });
    });

    describe('compareChannel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChannel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareChannel(entity1, entity2);
        const compareResult2 = service.compareChannel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareChannel(entity1, entity2);
        const compareResult2 = service.compareChannel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareChannel(entity1, entity2);
        const compareResult2 = service.compareChannel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IGeolocationCoordinates } from '../geolocation-coordinates.model';
import { GeolocationCoordinatesService } from '../service/geolocation-coordinates.service';

import geolocationCoordinatesResolve from './geolocation-coordinates-routing-resolve.service';

describe('GeolocationCoordinates routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: GeolocationCoordinatesService;
  let resultGeolocationCoordinates: IGeolocationCoordinates | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(GeolocationCoordinatesService);
    resultGeolocationCoordinates = undefined;
  });

  describe('resolve', () => {
    it('should return IGeolocationCoordinates returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      TestBed.runInInjectionContext(() => {
        geolocationCoordinatesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultGeolocationCoordinates = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultGeolocationCoordinates).toEqual({ id: 'ABC' });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        geolocationCoordinatesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultGeolocationCoordinates = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultGeolocationCoordinates).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IGeolocationCoordinates>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      TestBed.runInInjectionContext(() => {
        geolocationCoordinatesResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultGeolocationCoordinates = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultGeolocationCoordinates).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GeolocationCoordinatesService } from '../service/geolocation-coordinates.service';

import { GeolocationCoordinatesComponent } from './geolocation-coordinates.component';

describe('GeolocationCoordinates Management Component', () => {
  let comp: GeolocationCoordinatesComponent;
  let fixture: ComponentFixture<GeolocationCoordinatesComponent>;
  let service: GeolocationCoordinatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'geolocation-coordinates', component: GeolocationCoordinatesComponent }]),
        HttpClientTestingModule,
        GeolocationCoordinatesComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(GeolocationCoordinatesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GeolocationCoordinatesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GeolocationCoordinatesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.geolocationCoordinates?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to geolocationCoordinatesService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getGeolocationCoordinatesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGeolocationCoordinatesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

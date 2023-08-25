import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GeolocationCoordinatesFormService } from './geolocation-coordinates-form.service';
import { GeolocationCoordinatesService } from '../service/geolocation-coordinates.service';
import { IGeolocationCoordinates } from '../geolocation-coordinates.model';

import { GeolocationCoordinatesUpdateComponent } from './geolocation-coordinates-update.component';

describe('GeolocationCoordinates Management Update Component', () => {
  let comp: GeolocationCoordinatesUpdateComponent;
  let fixture: ComponentFixture<GeolocationCoordinatesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let geolocationCoordinatesFormService: GeolocationCoordinatesFormService;
  let geolocationCoordinatesService: GeolocationCoordinatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), GeolocationCoordinatesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GeolocationCoordinatesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GeolocationCoordinatesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    geolocationCoordinatesFormService = TestBed.inject(GeolocationCoordinatesFormService);
    geolocationCoordinatesService = TestBed.inject(GeolocationCoordinatesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const geolocationCoordinates: IGeolocationCoordinates = { id: 'CBA' };

      activatedRoute.data = of({ geolocationCoordinates });
      comp.ngOnInit();

      expect(comp.geolocationCoordinates).toEqual(geolocationCoordinates);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGeolocationCoordinates>>();
      const geolocationCoordinates = { id: 'ABC' };
      jest.spyOn(geolocationCoordinatesFormService, 'getGeolocationCoordinates').mockReturnValue(geolocationCoordinates);
      jest.spyOn(geolocationCoordinatesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ geolocationCoordinates });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: geolocationCoordinates }));
      saveSubject.complete();

      // THEN
      expect(geolocationCoordinatesFormService.getGeolocationCoordinates).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(geolocationCoordinatesService.update).toHaveBeenCalledWith(expect.objectContaining(geolocationCoordinates));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGeolocationCoordinates>>();
      const geolocationCoordinates = { id: 'ABC' };
      jest.spyOn(geolocationCoordinatesFormService, 'getGeolocationCoordinates').mockReturnValue({ id: null });
      jest.spyOn(geolocationCoordinatesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ geolocationCoordinates: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: geolocationCoordinates }));
      saveSubject.complete();

      // THEN
      expect(geolocationCoordinatesFormService.getGeolocationCoordinates).toHaveBeenCalled();
      expect(geolocationCoordinatesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGeolocationCoordinates>>();
      const geolocationCoordinates = { id: 'ABC' };
      jest.spyOn(geolocationCoordinatesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ geolocationCoordinates });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(geolocationCoordinatesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

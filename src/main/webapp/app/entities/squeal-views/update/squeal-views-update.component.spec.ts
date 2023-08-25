import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SquealViewsFormService } from './squeal-views-form.service';
import { SquealViewsService } from '../service/squeal-views.service';
import { ISquealViews } from '../squeal-views.model';

import { SquealViewsUpdateComponent } from './squeal-views-update.component';

describe('SquealViews Management Update Component', () => {
  let comp: SquealViewsUpdateComponent;
  let fixture: ComponentFixture<SquealViewsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let squealViewsFormService: SquealViewsFormService;
  let squealViewsService: SquealViewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SquealViewsUpdateComponent],
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
      .overrideTemplate(SquealViewsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SquealViewsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    squealViewsFormService = TestBed.inject(SquealViewsFormService);
    squealViewsService = TestBed.inject(SquealViewsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const squealViews: ISquealViews = { id: 'CBA' };

      activatedRoute.data = of({ squealViews });
      comp.ngOnInit();

      expect(comp.squealViews).toEqual(squealViews);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealViews>>();
      const squealViews = { id: 'ABC' };
      jest.spyOn(squealViewsFormService, 'getSquealViews').mockReturnValue(squealViews);
      jest.spyOn(squealViewsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealViews });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squealViews }));
      saveSubject.complete();

      // THEN
      expect(squealViewsFormService.getSquealViews).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(squealViewsService.update).toHaveBeenCalledWith(expect.objectContaining(squealViews));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealViews>>();
      const squealViews = { id: 'ABC' };
      jest.spyOn(squealViewsFormService, 'getSquealViews').mockReturnValue({ id: null });
      jest.spyOn(squealViewsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealViews: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squealViews }));
      saveSubject.complete();

      // THEN
      expect(squealViewsFormService.getSquealViews).toHaveBeenCalled();
      expect(squealViewsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealViews>>();
      const squealViews = { id: 'ABC' };
      jest.spyOn(squealViewsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealViews });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(squealViewsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

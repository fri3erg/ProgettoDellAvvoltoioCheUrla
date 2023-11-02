import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SquealFormService } from './squeal-form.service';
import { SquealService } from '../service/squeal.service';
import { ISqueal } from '../squeal.model';

import { SquealUpdateComponent } from './squeal-update.component';

describe('Squeal Management Update Component', () => {
  let comp: SquealUpdateComponent;
  let fixture: ComponentFixture<SquealUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let squealFormService: SquealFormService;
  let squealService: SquealService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SquealUpdateComponent],
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
      .overrideTemplate(SquealUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SquealUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    squealFormService = TestBed.inject(SquealFormService);
    squealService = TestBed.inject(SquealService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const squeal: ISqueal = { _id: 'CBA' };

      activatedRoute.data = of({ squeal });
      comp.ngOnInit();

      expect(comp.squeal).toEqual(squeal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISqueal>>();
      const squeal = { id: 'ABC' };
      jest.spyOn(squealFormService, 'getSqueal').mockReturnValue(squeal);
      jest.spyOn(squealService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squeal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squeal }));
      saveSubject.complete();

      // THEN
      expect(squealFormService.getSqueal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(squealService.update).toHaveBeenCalledWith(expect.objectContaining(squeal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISqueal>>();
      const squeal = { id: 'ABC' };
      jest.spyOn(squealFormService, 'getSqueal').mockReturnValue({ _id: null });
      jest.spyOn(squealService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squeal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squeal }));
      saveSubject.complete();

      // THEN
      expect(squealFormService.getSqueal).toHaveBeenCalled();
      expect(squealService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISqueal>>();
      const squeal = { id: 'ABC' };
      jest.spyOn(squealService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squeal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(squealService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

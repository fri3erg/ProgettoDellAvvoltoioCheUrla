import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SquealCatFormService } from './squeal-cat-form.service';
import { SquealCatService } from '../service/squeal-cat.service';
import { ISquealCat } from '../squeal-cat.model';

import { SquealCatUpdateComponent } from './squeal-cat-update.component';

describe('SquealCat Management Update Component', () => {
  let comp: SquealCatUpdateComponent;
  let fixture: ComponentFixture<SquealCatUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let squealCatFormService: SquealCatFormService;
  let squealCatService: SquealCatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SquealCatUpdateComponent],
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
      .overrideTemplate(SquealCatUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SquealCatUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    squealCatFormService = TestBed.inject(SquealCatFormService);
    squealCatService = TestBed.inject(SquealCatService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const squealCat: ISquealCat = { id: 'CBA' };

      activatedRoute.data = of({ squealCat });
      comp.ngOnInit();

      expect(comp.squealCat).toEqual(squealCat);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealCat>>();
      const squealCat = { id: 'ABC' };
      jest.spyOn(squealCatFormService, 'getSquealCat').mockReturnValue(squealCat);
      jest.spyOn(squealCatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealCat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squealCat }));
      saveSubject.complete();

      // THEN
      expect(squealCatFormService.getSquealCat).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(squealCatService.update).toHaveBeenCalledWith(expect.objectContaining(squealCat));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealCat>>();
      const squealCat = { id: 'ABC' };
      jest.spyOn(squealCatFormService, 'getSquealCat').mockReturnValue({ id: null });
      jest.spyOn(squealCatService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealCat: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squealCat }));
      saveSubject.complete();

      // THEN
      expect(squealCatFormService.getSquealCat).toHaveBeenCalled();
      expect(squealCatService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealCat>>();
      const squealCat = { id: 'ABC' };
      jest.spyOn(squealCatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealCat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(squealCatService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

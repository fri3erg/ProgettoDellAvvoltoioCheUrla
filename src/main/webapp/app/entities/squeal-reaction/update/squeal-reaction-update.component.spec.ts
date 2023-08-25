import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SquealReactionFormService } from './squeal-reaction-form.service';
import { SquealReactionService } from '../service/squeal-reaction.service';
import { ISquealReaction } from '../squeal-reaction.model';

import { SquealReactionUpdateComponent } from './squeal-reaction-update.component';

describe('SquealReaction Management Update Component', () => {
  let comp: SquealReactionUpdateComponent;
  let fixture: ComponentFixture<SquealReactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let squealReactionFormService: SquealReactionFormService;
  let squealReactionService: SquealReactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SquealReactionUpdateComponent],
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
      .overrideTemplate(SquealReactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SquealReactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    squealReactionFormService = TestBed.inject(SquealReactionFormService);
    squealReactionService = TestBed.inject(SquealReactionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const squealReaction: ISquealReaction = { id: 'CBA' };

      activatedRoute.data = of({ squealReaction });
      comp.ngOnInit();

      expect(comp.squealReaction).toEqual(squealReaction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealReaction>>();
      const squealReaction = { id: 'ABC' };
      jest.spyOn(squealReactionFormService, 'getSquealReaction').mockReturnValue(squealReaction);
      jest.spyOn(squealReactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealReaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squealReaction }));
      saveSubject.complete();

      // THEN
      expect(squealReactionFormService.getSquealReaction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(squealReactionService.update).toHaveBeenCalledWith(expect.objectContaining(squealReaction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealReaction>>();
      const squealReaction = { id: 'ABC' };
      jest.spyOn(squealReactionFormService, 'getSquealReaction').mockReturnValue({ id: null });
      jest.spyOn(squealReactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealReaction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: squealReaction }));
      saveSubject.complete();

      // THEN
      expect(squealReactionFormService.getSquealReaction).toHaveBeenCalled();
      expect(squealReactionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISquealReaction>>();
      const squealReaction = { id: 'ABC' };
      jest.spyOn(squealReactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ squealReaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(squealReactionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

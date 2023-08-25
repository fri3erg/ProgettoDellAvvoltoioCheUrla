import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserCharsFormService } from './user-chars-form.service';
import { UserCharsService } from '../service/user-chars.service';
import { IUserChars } from '../user-chars.model';

import { UserCharsUpdateComponent } from './user-chars-update.component';

describe('UserChars Management Update Component', () => {
  let comp: UserCharsUpdateComponent;
  let fixture: ComponentFixture<UserCharsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userCharsFormService: UserCharsFormService;
  let userCharsService: UserCharsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UserCharsUpdateComponent],
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
      .overrideTemplate(UserCharsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserCharsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userCharsFormService = TestBed.inject(UserCharsFormService);
    userCharsService = TestBed.inject(UserCharsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userChars: IUserChars = { id: 'CBA' };

      activatedRoute.data = of({ userChars });
      comp.ngOnInit();

      expect(comp.userChars).toEqual(userChars);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserChars>>();
      const userChars = { id: 'ABC' };
      jest.spyOn(userCharsFormService, 'getUserChars').mockReturnValue(userChars);
      jest.spyOn(userCharsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userChars });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userChars }));
      saveSubject.complete();

      // THEN
      expect(userCharsFormService.getUserChars).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userCharsService.update).toHaveBeenCalledWith(expect.objectContaining(userChars));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserChars>>();
      const userChars = { id: 'ABC' };
      jest.spyOn(userCharsFormService, 'getUserChars').mockReturnValue({ id: null });
      jest.spyOn(userCharsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userChars: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userChars }));
      saveSubject.complete();

      // THEN
      expect(userCharsFormService.getUserChars).toHaveBeenCalled();
      expect(userCharsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserChars>>();
      const userChars = { id: 'ABC' };
      jest.spyOn(userCharsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userChars });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userCharsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

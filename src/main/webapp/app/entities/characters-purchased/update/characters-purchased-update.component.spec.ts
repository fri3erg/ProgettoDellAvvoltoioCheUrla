import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharactersPurchasedFormService } from './characters-purchased-form.service';
import { CharactersPurchasedService } from '../service/characters-purchased.service';
import { ICharactersPurchased } from '../characters-purchased.model';

import { CharactersPurchasedUpdateComponent } from './characters-purchased-update.component';

describe('CharactersPurchased Management Update Component', () => {
  let comp: CharactersPurchasedUpdateComponent;
  let fixture: ComponentFixture<CharactersPurchasedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charactersPurchasedFormService: CharactersPurchasedFormService;
  let charactersPurchasedService: CharactersPurchasedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CharactersPurchasedUpdateComponent],
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
      .overrideTemplate(CharactersPurchasedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharactersPurchasedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charactersPurchasedFormService = TestBed.inject(CharactersPurchasedFormService);
    charactersPurchasedService = TestBed.inject(CharactersPurchasedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const charactersPurchased: ICharactersPurchased = { id: 'CBA' };

      activatedRoute.data = of({ charactersPurchased });
      comp.ngOnInit();

      expect(comp.charactersPurchased).toEqual(charactersPurchased);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharactersPurchased>>();
      const charactersPurchased = { id: 'ABC' };
      jest.spyOn(charactersPurchasedFormService, 'getCharactersPurchased').mockReturnValue(charactersPurchased);
      jest.spyOn(charactersPurchasedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charactersPurchased });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charactersPurchased }));
      saveSubject.complete();

      // THEN
      expect(charactersPurchasedFormService.getCharactersPurchased).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charactersPurchasedService.update).toHaveBeenCalledWith(expect.objectContaining(charactersPurchased));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharactersPurchased>>();
      const charactersPurchased = { id: 'ABC' };
      jest.spyOn(charactersPurchasedFormService, 'getCharactersPurchased').mockReturnValue({ id: null });
      jest.spyOn(charactersPurchasedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charactersPurchased: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charactersPurchased }));
      saveSubject.complete();

      // THEN
      expect(charactersPurchasedFormService.getCharactersPurchased).toHaveBeenCalled();
      expect(charactersPurchasedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharactersPurchased>>();
      const charactersPurchased = { id: 'ABC' };
      jest.spyOn(charactersPurchasedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charactersPurchased });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charactersPurchasedService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

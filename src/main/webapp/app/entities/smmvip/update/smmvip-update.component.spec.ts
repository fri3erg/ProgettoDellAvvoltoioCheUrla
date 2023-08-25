import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SMMVIPFormService } from './smmvip-form.service';
import { SMMVIPService } from '../service/smmvip.service';
import { ISMMVIP } from '../smmvip.model';

import { SMMVIPUpdateComponent } from './smmvip-update.component';

describe('SMMVIP Management Update Component', () => {
  let comp: SMMVIPUpdateComponent;
  let fixture: ComponentFixture<SMMVIPUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sMMVIPFormService: SMMVIPFormService;
  let sMMVIPService: SMMVIPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SMMVIPUpdateComponent],
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
      .overrideTemplate(SMMVIPUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SMMVIPUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sMMVIPFormService = TestBed.inject(SMMVIPFormService);
    sMMVIPService = TestBed.inject(SMMVIPService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sMMVIP: ISMMVIP = { id: 'CBA' };

      activatedRoute.data = of({ sMMVIP });
      comp.ngOnInit();

      expect(comp.sMMVIP).toEqual(sMMVIP);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISMMVIP>>();
      const sMMVIP = { id: 'ABC' };
      jest.spyOn(sMMVIPFormService, 'getSMMVIP').mockReturnValue(sMMVIP);
      jest.spyOn(sMMVIPService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sMMVIP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sMMVIP }));
      saveSubject.complete();

      // THEN
      expect(sMMVIPFormService.getSMMVIP).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sMMVIPService.update).toHaveBeenCalledWith(expect.objectContaining(sMMVIP));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISMMVIP>>();
      const sMMVIP = { id: 'ABC' };
      jest.spyOn(sMMVIPFormService, 'getSMMVIP').mockReturnValue({ id: null });
      jest.spyOn(sMMVIPService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sMMVIP: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sMMVIP }));
      saveSubject.complete();

      // THEN
      expect(sMMVIPFormService.getSMMVIP).toHaveBeenCalled();
      expect(sMMVIPService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISMMVIP>>();
      const sMMVIP = { id: 'ABC' };
      jest.spyOn(sMMVIPService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sMMVIP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sMMVIPService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

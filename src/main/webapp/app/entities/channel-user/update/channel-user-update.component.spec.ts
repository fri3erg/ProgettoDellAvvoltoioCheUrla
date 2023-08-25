import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChannelUserFormService } from './channel-user-form.service';
import { ChannelUserService } from '../service/channel-user.service';
import { IChannelUser } from '../channel-user.model';

import { ChannelUserUpdateComponent } from './channel-user-update.component';

describe('ChannelUser Management Update Component', () => {
  let comp: ChannelUserUpdateComponent;
  let fixture: ComponentFixture<ChannelUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let channelUserFormService: ChannelUserFormService;
  let channelUserService: ChannelUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ChannelUserUpdateComponent],
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
      .overrideTemplate(ChannelUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChannelUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    channelUserFormService = TestBed.inject(ChannelUserFormService);
    channelUserService = TestBed.inject(ChannelUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const channelUser: IChannelUser = { id: 'CBA' };

      activatedRoute.data = of({ channelUser });
      comp.ngOnInit();

      expect(comp.channelUser).toEqual(channelUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChannelUser>>();
      const channelUser = { id: 'ABC' };
      jest.spyOn(channelUserFormService, 'getChannelUser').mockReturnValue(channelUser);
      jest.spyOn(channelUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ channelUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: channelUser }));
      saveSubject.complete();

      // THEN
      expect(channelUserFormService.getChannelUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(channelUserService.update).toHaveBeenCalledWith(expect.objectContaining(channelUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChannelUser>>();
      const channelUser = { id: 'ABC' };
      jest.spyOn(channelUserFormService, 'getChannelUser').mockReturnValue({ id: null });
      jest.spyOn(channelUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ channelUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: channelUser }));
      saveSubject.complete();

      // THEN
      expect(channelUserFormService.getChannelUser).toHaveBeenCalled();
      expect(channelUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChannelUser>>();
      const channelUser = { id: 'ABC' };
      jest.spyOn(channelUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ channelUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(channelUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

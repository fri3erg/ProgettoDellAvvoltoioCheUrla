import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChannelUserService } from '../service/channel-user.service';

import { ChannelUserComponent } from './channel-user.component';

describe('ChannelUser Management Component', () => {
  let comp: ChannelUserComponent;
  let fixture: ComponentFixture<ChannelUserComponent>;
  let service: ChannelUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'channel-user', component: ChannelUserComponent }]),
        HttpClientTestingModule,
        ChannelUserComponent,
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
      .overrideTemplate(ChannelUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChannelUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChannelUserService);

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
    expect(comp.channelUsers?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to channelUserService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getChannelUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChannelUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

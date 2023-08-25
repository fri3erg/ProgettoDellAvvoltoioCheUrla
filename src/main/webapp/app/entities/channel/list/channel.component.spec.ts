import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChannelService } from '../service/channel.service';

import { ChannelComponent } from './channel.component';

describe('Channel Management Component', () => {
  let comp: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;
  let service: ChannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'channel', component: ChannelComponent }]),
        HttpClientTestingModule,
        ChannelComponent,
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
      .overrideTemplate(ChannelComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChannelComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChannelService);

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
    expect(comp.channels?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to channelService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getChannelIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getChannelIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

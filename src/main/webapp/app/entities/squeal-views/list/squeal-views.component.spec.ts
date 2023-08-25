import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SquealViewsService } from '../service/squeal-views.service';

import { SquealViewsComponent } from './squeal-views.component';

describe('SquealViews Management Component', () => {
  let comp: SquealViewsComponent;
  let fixture: ComponentFixture<SquealViewsComponent>;
  let service: SquealViewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'squeal-views', component: SquealViewsComponent }]),
        HttpClientTestingModule,
        SquealViewsComponent,
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
      .overrideTemplate(SquealViewsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SquealViewsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SquealViewsService);

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
    expect(comp.squealViews?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to squealViewsService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getSquealViewsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSquealViewsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

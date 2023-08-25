import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SquealService } from '../service/squeal.service';

import { SquealComponent } from './squeal.component';

describe('Squeal Management Component', () => {
  let comp: SquealComponent;
  let fixture: ComponentFixture<SquealComponent>;
  let service: SquealService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'squeal', component: SquealComponent }]), HttpClientTestingModule, SquealComponent],
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
      .overrideTemplate(SquealComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SquealComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SquealService);

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
    expect(comp.squeals?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to squealService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getSquealIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSquealIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

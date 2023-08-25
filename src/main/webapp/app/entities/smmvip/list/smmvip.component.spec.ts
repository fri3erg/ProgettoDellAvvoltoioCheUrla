import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SMMVIPService } from '../service/smmvip.service';

import { SMMVIPComponent } from './smmvip.component';

describe('SMMVIP Management Component', () => {
  let comp: SMMVIPComponent;
  let fixture: ComponentFixture<SMMVIPComponent>;
  let service: SMMVIPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'smmvip', component: SMMVIPComponent }]), HttpClientTestingModule, SMMVIPComponent],
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
      .overrideTemplate(SMMVIPComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SMMVIPComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SMMVIPService);

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
    expect(comp.sMMVIPS?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to sMMVIPService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getSMMVIPIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSMMVIPIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

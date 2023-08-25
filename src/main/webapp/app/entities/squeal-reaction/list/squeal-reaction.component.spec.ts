import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SquealReactionService } from '../service/squeal-reaction.service';

import { SquealReactionComponent } from './squeal-reaction.component';

describe('SquealReaction Management Component', () => {
  let comp: SquealReactionComponent;
  let fixture: ComponentFixture<SquealReactionComponent>;
  let service: SquealReactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'squeal-reaction', component: SquealReactionComponent }]),
        HttpClientTestingModule,
        SquealReactionComponent,
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
      .overrideTemplate(SquealReactionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SquealReactionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SquealReactionService);

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
    expect(comp.squealReactions?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to squealReactionService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getSquealReactionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSquealReactionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

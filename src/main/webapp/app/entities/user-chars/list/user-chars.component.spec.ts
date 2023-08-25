import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserCharsService } from '../service/user-chars.service';

import { UserCharsComponent } from './user-chars.component';

describe('UserChars Management Component', () => {
  let comp: UserCharsComponent;
  let fixture: ComponentFixture<UserCharsComponent>;
  let service: UserCharsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user-chars', component: UserCharsComponent }]),
        HttpClientTestingModule,
        UserCharsComponent,
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
      .overrideTemplate(UserCharsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserCharsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserCharsService);

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
    expect(comp.userChars?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to userCharsService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getUserCharsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserCharsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

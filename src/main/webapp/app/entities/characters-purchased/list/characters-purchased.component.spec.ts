import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CharactersPurchasedService } from '../service/characters-purchased.service';

import { CharactersPurchasedComponent } from './characters-purchased.component';

describe('CharactersPurchased Management Component', () => {
  let comp: CharactersPurchasedComponent;
  let fixture: ComponentFixture<CharactersPurchasedComponent>;
  let service: CharactersPurchasedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'characters-purchased', component: CharactersPurchasedComponent }]),
        HttpClientTestingModule,
        CharactersPurchasedComponent,
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
      .overrideTemplate(CharactersPurchasedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharactersPurchasedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CharactersPurchasedService);

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
    expect(comp.charactersPurchaseds?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to charactersPurchasedService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getCharactersPurchasedIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCharactersPurchasedIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

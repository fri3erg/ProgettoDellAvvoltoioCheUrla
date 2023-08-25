import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SquealCatDetailComponent } from './squeal-cat-detail.component';

describe('SquealCat Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquealCatDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SquealCatDetailComponent,
              resolve: { squealCat: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(SquealCatDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load squealCat on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SquealCatDetailComponent);

      // THEN
      expect(instance.squealCat).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

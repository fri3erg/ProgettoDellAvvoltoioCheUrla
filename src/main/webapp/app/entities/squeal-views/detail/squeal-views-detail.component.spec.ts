import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SquealViewsDetailComponent } from './squeal-views-detail.component';

describe('SquealViews Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquealViewsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SquealViewsDetailComponent,
              resolve: { squealViews: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(SquealViewsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load squealViews on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SquealViewsDetailComponent);

      // THEN
      expect(instance.squealViews).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

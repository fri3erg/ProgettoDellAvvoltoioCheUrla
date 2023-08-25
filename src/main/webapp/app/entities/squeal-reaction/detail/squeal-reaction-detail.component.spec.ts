import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SquealReactionDetailComponent } from './squeal-reaction-detail.component';

describe('SquealReaction Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquealReactionDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SquealReactionDetailComponent,
              resolve: { squealReaction: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(SquealReactionDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load squealReaction on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SquealReactionDetailComponent);

      // THEN
      expect(instance.squealReaction).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

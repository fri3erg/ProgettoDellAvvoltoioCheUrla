import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CharactersPurchasedDetailComponent } from './characters-purchased-detail.component';

describe('CharactersPurchased Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersPurchasedDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CharactersPurchasedDetailComponent,
              resolve: { charactersPurchased: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(CharactersPurchasedDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load charactersPurchased on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CharactersPurchasedDetailComponent);

      // THEN
      expect(instance.charactersPurchased).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

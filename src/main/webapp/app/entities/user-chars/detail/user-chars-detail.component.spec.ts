import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserCharsDetailComponent } from './user-chars-detail.component';

describe('UserChars Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCharsDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UserCharsDetailComponent,
              resolve: { userChars: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(UserCharsDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load userChars on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UserCharsDetailComponent);

      // THEN
      expect(instance.userChars).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

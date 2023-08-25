import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SMMVIPDetailComponent } from './smmvip-detail.component';

describe('SMMVIP Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SMMVIPDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SMMVIPDetailComponent,
              resolve: { sMMVIP: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(SMMVIPDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load sMMVIP on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SMMVIPDetailComponent);

      // THEN
      expect(instance.sMMVIP).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

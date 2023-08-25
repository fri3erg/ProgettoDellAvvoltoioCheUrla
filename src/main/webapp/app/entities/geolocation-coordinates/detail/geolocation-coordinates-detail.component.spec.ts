import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GeolocationCoordinatesDetailComponent } from './geolocation-coordinates-detail.component';

describe('GeolocationCoordinates Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeolocationCoordinatesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GeolocationCoordinatesDetailComponent,
              resolve: { geolocationCoordinates: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(GeolocationCoordinatesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load geolocationCoordinates on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GeolocationCoordinatesDetailComponent);

      // THEN
      expect(instance.geolocationCoordinates).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

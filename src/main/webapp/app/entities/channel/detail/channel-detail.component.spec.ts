import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChannelDetailComponent } from './channel-detail.component';

describe('Channel Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ChannelDetailComponent,
              resolve: { channel: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ChannelDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load channel on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ChannelDetailComponent);

      // THEN
      expect(instance.channel).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

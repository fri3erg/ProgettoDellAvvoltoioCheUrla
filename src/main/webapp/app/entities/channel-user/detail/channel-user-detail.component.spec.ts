import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ChannelUserDetailComponent } from './channel-user-detail.component';

describe('ChannelUser Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelUserDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ChannelUserDetailComponent,
              resolve: { channelUser: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(ChannelUserDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load channelUser on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ChannelUserDetailComponent);

      // THEN
      expect(instance.channelUser).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});

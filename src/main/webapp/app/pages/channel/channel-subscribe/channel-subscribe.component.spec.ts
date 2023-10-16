import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelSubscribeComponent } from './channel-subscribe.component';

describe('ChannelSubscribeComponent', () => {
  let component: ChannelSubscribeComponent;
  let fixture: ComponentFixture<ChannelSubscribeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChannelSubscribeComponent],
    });
    fixture = TestBed.createComponent(ChannelSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

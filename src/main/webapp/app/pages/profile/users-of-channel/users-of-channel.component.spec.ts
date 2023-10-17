import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOfChannelComponent } from './users-of-channel.component';

describe('UsersOfChannelComponent', () => {
  let component: UsersOfChannelComponent;
  let fixture: ComponentFixture<UsersOfChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersOfChannelComponent],
    });
    fixture = TestBed.createComponent(UsersOfChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

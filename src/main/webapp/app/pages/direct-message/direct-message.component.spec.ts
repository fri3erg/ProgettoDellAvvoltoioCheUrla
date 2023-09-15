import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessageComponent } from './direct-message.component';

describe('DirectMessageComponent', () => {
  let component: DirectMessageComponent;
  let fixture: ComponentFixture<DirectMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DirectMessageComponent],
    });
    fixture = TestBed.createComponent(DirectMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

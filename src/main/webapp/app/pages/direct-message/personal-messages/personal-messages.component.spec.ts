import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalMessagesComponent } from './personal-messages.component';

describe('PersonalMessagesComponent', () => {
  let component: PersonalMessagesComponent;
  let fixture: ComponentFixture<PersonalMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonalMessagesComponent],
    });
    fixture = TestBed.createComponent(PersonalMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

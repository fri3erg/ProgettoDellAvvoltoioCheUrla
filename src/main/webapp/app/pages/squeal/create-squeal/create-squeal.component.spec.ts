import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSquealComponent } from './create-squeal.component';

describe('CreateSquealComponent', () => {
  let component: CreateSquealComponent;
  let fixture: ComponentFixture<CreateSquealComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSquealComponent],
    });
    fixture = TestBed.createComponent(CreateSquealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

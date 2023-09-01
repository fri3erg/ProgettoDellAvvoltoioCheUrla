import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquealViewComponent } from './squeal-view.component';

describe('SquealViewComponent', () => {
  let component: SquealViewComponent;
  let fixture: ComponentFixture<SquealViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SquealViewComponent],
    });
    fixture = TestBed.createComponent(SquealViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

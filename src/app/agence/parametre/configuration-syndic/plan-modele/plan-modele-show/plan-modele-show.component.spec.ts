import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanModeleShowComponent } from './plan-modele-show.component';

describe('PlanModeleShowComponent', () => {
  let component: PlanModeleShowComponent;
  let fixture: ComponentFixture<PlanModeleShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanModeleShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanModeleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

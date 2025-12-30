import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanModeleAddComponent } from './plan-modele-add.component';

describe('PlanModeleAddComponent', () => {
  let component: PlanModeleAddComponent;
  let fixture: ComponentFixture<PlanModeleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanModeleAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanModeleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

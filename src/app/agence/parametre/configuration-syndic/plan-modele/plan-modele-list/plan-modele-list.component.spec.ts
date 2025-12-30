import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanModeleListComponent } from './plan-modele-list.component';

describe('PlanModeleListComponent', () => {
  let component: PlanModeleListComponent;
  let fixture: ComponentFixture<PlanModeleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanModeleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanModeleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

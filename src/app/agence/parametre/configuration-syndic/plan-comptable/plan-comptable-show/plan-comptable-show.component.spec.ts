import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComptableShowComponent } from './plan-comptable-show.component';

describe('PlanComptableShowComponent', () => {
  let component: PlanComptableShowComponent;
  let fixture: ComponentFixture<PlanComptableShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanComptableShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComptableShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

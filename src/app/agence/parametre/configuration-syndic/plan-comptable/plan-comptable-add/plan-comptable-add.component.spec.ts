import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComptableAddComponent } from './plan-comptable-add.component';

describe('PlanComptableAddComponent', () => {
  let component: PlanComptableAddComponent;
  let fixture: ComponentFixture<PlanComptableAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanComptableAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComptableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

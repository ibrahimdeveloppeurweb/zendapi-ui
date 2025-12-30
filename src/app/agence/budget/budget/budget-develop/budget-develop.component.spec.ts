import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDevelopComponent } from './budget-develop.component';

describe('BudgetDevelopComponent', () => {
  let component: BudgetDevelopComponent;
  let fixture: ComponentFixture<BudgetDevelopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetDevelopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetDevelopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

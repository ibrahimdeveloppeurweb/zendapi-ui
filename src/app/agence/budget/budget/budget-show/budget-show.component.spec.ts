import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetShowComponent } from './budget-show.component';

describe('BudgetShowComponent', () => {
  let component: BudgetShowComponent;
  let fixture: ComponentFixture<BudgetShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

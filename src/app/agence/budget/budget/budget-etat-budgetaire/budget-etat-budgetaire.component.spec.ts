import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEtatBudgetaireComponent } from './budget-etat-budgetaire.component';

describe('BudgetEtatBudgetaireComponent', () => {
  let component: BudgetEtatBudgetaireComponent;
  let fixture: ComponentFixture<BudgetEtatBudgetaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetEtatBudgetaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetEtatBudgetaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

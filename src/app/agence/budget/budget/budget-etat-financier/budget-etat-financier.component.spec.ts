import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEtatFinancierComponent } from './budget-etat-financier.component';

describe('BudgetEtatFinancierComponent', () => {
  let component: BudgetEtatFinancierComponent;
  let fixture: ComponentFixture<BudgetEtatFinancierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetEtatFinancierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetEtatFinancierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

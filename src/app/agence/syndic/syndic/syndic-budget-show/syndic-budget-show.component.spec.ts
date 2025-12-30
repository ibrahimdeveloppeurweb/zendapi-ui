import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicBudgetShowComponent } from './syndic-budget-show.component';

describe('SyndicBudgetShowComponent', () => {
  let component: SyndicBudgetShowComponent;
  let fixture: ComponentFixture<SyndicBudgetShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicBudgetShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicBudgetShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

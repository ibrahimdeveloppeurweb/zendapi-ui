import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicBudgetListComponent } from './syndic-budget-list.component';



describe('SyndicBudgetListComponent', () => {
  let component: SyndicBudgetListComponent;
  let fixture: ComponentFixture<SyndicBudgetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicBudgetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicBudgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


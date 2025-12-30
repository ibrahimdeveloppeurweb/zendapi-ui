import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryAccountStatementComponent } from './treasury-account-statement.component';

describe('TreasuryAccountStatementComponent', () => {
  let component: TreasuryAccountStatementComponent;
  let fixture: ComponentFixture<TreasuryAccountStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryAccountStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryAccountStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRepaymentListComponent } from './payment-repayment-list.component';

describe('PaymentRepaymentListComponent', () => {
  let component: PaymentRepaymentListComponent;
  let fixture: ComponentFixture<PaymentRepaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRepaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRepaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

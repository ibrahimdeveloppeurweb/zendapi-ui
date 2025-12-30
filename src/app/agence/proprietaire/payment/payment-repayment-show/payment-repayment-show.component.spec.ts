import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRepaymentShowComponent } from './payment-repayment-show.component';

describe('PaymentRepaymentShowComponent', () => {
  let component: PaymentRepaymentShowComponent;
  let fixture: ComponentFixture<PaymentRepaymentShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRepaymentShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRepaymentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

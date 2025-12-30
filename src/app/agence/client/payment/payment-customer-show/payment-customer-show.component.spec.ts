import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCustomerShowComponent } from '@client/payment/payment-customer-show/payment-customer-show.component';

describe('PaymentShowComponent', () => {
  let component: PaymentCustomerShowComponent;
  let fixture: ComponentFixture<PaymentCustomerShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCustomerShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCustomerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

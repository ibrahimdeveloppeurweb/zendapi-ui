import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRepaymentAddComponent } from './payment-repayment-add.component';

describe('PaymentRepaymentAddComponent', () => {
  let component: PaymentRepaymentAddComponent;
  let fixture: ComponentFixture<PaymentRepaymentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRepaymentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRepaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

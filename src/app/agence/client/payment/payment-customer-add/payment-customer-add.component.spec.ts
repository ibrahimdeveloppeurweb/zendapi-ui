import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCustomerAddComponent } from './payment-customer-add.component';

describe('PaymentAddComponent', () => {
  let component: PaymentCustomerAddComponent;
  let fixture: ComponentFixture<PaymentCustomerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCustomerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCustomerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

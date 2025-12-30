import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentCustomerListComponent } from '@client/payment/payment-customer-list/payment-customer-list.component';

describe('PayementCustomerListComponent', () => {
  let component: PaymentCustomerListComponent;
  let fixture: ComponentFixture<PaymentCustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCustomerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

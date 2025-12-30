import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFundingAddComponent } from './payment-funding-add.component';

describe('PaymentFundingAddComponent', () => {
  let component: PaymentFundingAddComponent;
  let fixture: ComponentFixture<PaymentFundingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentFundingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFundingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

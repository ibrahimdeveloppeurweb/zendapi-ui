import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFundingShowComponent } from './payment-funding-show.component';

describe('PaymentFundingShowComponent', () => {
  let component: PaymentFundingShowComponent;
  let fixture: ComponentFixture<PaymentFundingShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentFundingShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFundingShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFundingListComponent } from './payment-funding-list.component';

describe('PaymentFundingListComponent', () => {
  let component: PaymentFundingListComponent;
  let fixture: ComponentFixture<PaymentFundingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentFundingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFundingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

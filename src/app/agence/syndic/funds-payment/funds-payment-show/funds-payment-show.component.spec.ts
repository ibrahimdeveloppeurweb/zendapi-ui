import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsPaymentShowComponent } from './funds-payment-show.component';

describe('FundsPaymentShowComponent', () => {
  let component: FundsPaymentShowComponent;
  let fixture: ComponentFixture<FundsPaymentShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsPaymentShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsPaymentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

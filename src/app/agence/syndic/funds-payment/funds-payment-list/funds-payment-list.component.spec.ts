import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsPaymentListComponent } from './funds-payment-list.component';

describe('FundsPaymentListComponent', () => {
  let component: FundsPaymentListComponent;
  let fixture: ComponentFixture<FundsPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsPaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

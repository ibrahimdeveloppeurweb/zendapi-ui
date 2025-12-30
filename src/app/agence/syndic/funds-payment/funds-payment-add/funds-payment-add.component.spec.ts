import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsPaymentAddComponent } from './funds-payment-add.component';

describe('FundsPaymentAddComponent', () => {
  let component: FundsPaymentAddComponent;
  let fixture: ComponentFixture<FundsPaymentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsPaymentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsPaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentAddComponent } from './invoice-payment-add.component';

describe('InvoicePaymentAddComponent', () => {
  let component: InvoicePaymentAddComponent;
  let fixture: ComponentFixture<InvoicePaymentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePaymentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentShowComponent } from './invoice-payment-show.component';

describe('InvoicePaymentShowComponent', () => {
  let component: InvoicePaymentShowComponent;
  let fixture: ComponentFixture<InvoicePaymentShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePaymentShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaymentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

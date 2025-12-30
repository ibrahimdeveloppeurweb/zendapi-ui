import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCustomerShowComponent } from './invoice-customer-show.component';

describe('InvoiceCustomerShowComponent', () => {
  let component: InvoiceCustomerShowComponent;
  let fixture: ComponentFixture<InvoiceCustomerShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCustomerShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCustomerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCustomerListComponent } from './invoice-customer-list.component';

describe('InvoiceCustomerListComponent', () => {
  let component: InvoiceCustomerListComponent;
  let fixture: ComponentFixture<InvoiceCustomerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCustomerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

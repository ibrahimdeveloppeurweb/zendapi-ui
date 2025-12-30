import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceInvoiceListComponent } from './entrance-invoice-list.component';

describe('EntranceInvoiceListComponent', () => {
  let component: EntranceInvoiceListComponent;
  let fixture: ComponentFixture<EntranceInvoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntranceInvoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntranceInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

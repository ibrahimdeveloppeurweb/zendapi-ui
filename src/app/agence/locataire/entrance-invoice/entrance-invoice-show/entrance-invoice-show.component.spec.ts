import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceInvoiceShowComponent } from './entrance-invoice-show.component';

describe('EntranceInvoiceShowComponent', () => {
  let component: EntranceInvoiceShowComponent;
  let fixture: ComponentFixture<EntranceInvoiceShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntranceInvoiceShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntranceInvoiceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

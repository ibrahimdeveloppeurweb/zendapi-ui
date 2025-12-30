import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceShowComponent } from './invoice-show.component';

describe('InvoiceShowComponent', () => {
  let component: InvoiceShowComponent;
  let fixture: ComponentFixture<InvoiceShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

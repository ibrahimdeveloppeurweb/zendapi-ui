import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceOwnerListComponent } from './invoice-owner-list.component';

describe('InvoiceOwnerListComponent', () => {
  let component: InvoiceOwnerListComponent;
  let fixture: ComponentFixture<InvoiceOwnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceOwnerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceOwnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

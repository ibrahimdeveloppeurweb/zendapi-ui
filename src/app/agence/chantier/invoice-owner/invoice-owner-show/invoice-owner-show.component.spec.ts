import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceOwnerShowComponent } from './invoice-owner-show.component';

describe('InvoiceOwnerShowComponent', () => {
  let component: InvoiceOwnerShowComponent;
  let fixture: ComponentFixture<InvoiceOwnerShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceOwnerShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceOwnerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

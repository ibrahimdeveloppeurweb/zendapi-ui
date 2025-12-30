import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceOwnerAddComponent } from './invoice-owner-add.component';

describe('InvoiceOwnerAddComponent', () => {
  let component: InvoiceOwnerAddComponent;
  let fixture: ComponentFixture<InvoiceOwnerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceOwnerAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceOwnerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

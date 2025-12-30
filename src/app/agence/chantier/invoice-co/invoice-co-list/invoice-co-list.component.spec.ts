import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCoListComponent } from './invoice-co-list.component';

describe('InvoiceCoListComponent', () => {
  let component: InvoiceCoListComponent;
  let fixture: ComponentFixture<InvoiceCoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

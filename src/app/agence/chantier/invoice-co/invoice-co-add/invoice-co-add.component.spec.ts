import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCoAddComponent } from './invoice-co-add.component';

describe('InvoiceCoAddComponent', () => {
  let component: InvoiceCoAddComponent;
  let fixture: ComponentFixture<InvoiceCoAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCoAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

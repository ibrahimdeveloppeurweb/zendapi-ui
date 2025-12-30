import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCoShowComponent } from './invoice-co-show.component';

describe('InvoiceCoShowComponent', () => {
  let component: InvoiceCoShowComponent;
  let fixture: ComponentFixture<InvoiceCoShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCoShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCoShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

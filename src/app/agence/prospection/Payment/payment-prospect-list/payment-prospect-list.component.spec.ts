import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProspectListComponent } from './payment-prospect-list.component';

describe('PaymentProspectListComponent', () => {
  let component: PaymentProspectListComponent;
  let fixture: ComponentFixture<PaymentProspectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentProspectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentProspectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

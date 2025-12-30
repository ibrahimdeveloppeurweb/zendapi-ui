import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProspectAddComponent } from './payment-prospect-add.component';

describe('PaymentProspectAddComponent', () => {
  let component: PaymentProspectAddComponent;
  let fixture: ComponentFixture<PaymentProspectAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentProspectAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentProspectAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

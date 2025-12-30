import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaystackAccountAddComponent } from './paystack-account-add.component';

describe('PaystackAccountAddComponent', () => {
  let component: PaystackAccountAddComponent;
  let fixture: ComponentFixture<PaystackAccountAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaystackAccountAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaystackAccountAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

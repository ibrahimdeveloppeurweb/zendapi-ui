import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaystackAccountShowComponent } from './paystack-account-show.component';

describe('PaystackAccountAddComponent', () => {
  let component: PaystackAccountShowComponent;
  let fixture: ComponentFixture<PaystackAccountShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaystackAccountShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaystackAccountShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

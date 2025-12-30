import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentShowComponent } from './repayment-show.component';

describe('RepaymentShowComponent', () => {
  let component: RepaymentShowComponent;
  let fixture: ComponentFixture<RepaymentShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepaymentShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaymentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewContractShowComponent } from './renew-contract-show.component';

describe('RenewContractShowComponent', () => {
  let component: RenewContractShowComponent;
  let fixture: ComponentFixture<RenewContractShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewContractShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewContractShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

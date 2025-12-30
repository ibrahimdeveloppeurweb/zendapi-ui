import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewContractAddComponent } from './renew-contract-add.component';

describe('RenewContractAddComponent', () => {
  let component: RenewContractAddComponent;
  let fixture: ComponentFixture<RenewContractAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewContractAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewContractAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

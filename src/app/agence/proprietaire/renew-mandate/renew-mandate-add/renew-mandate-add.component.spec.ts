import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewMandateAddComponent } from './renew-add.component';

describe('RenewMandateAddComponent', () => {
  let component: RenewMandateAddComponent;
  let fixture: ComponentFixture<RenewMandateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewMandateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewMandateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

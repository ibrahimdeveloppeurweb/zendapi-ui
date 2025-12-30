import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewMandateShowComponent } from './renew-show.component';

describe('RenewMandateShowComponent', () => {
  let component: RenewMandateShowComponent;
  let fixture: ComponentFixture<RenewMandateShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewMandateShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewMandateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

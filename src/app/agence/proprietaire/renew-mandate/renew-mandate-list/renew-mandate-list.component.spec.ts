import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewMandateListComponent } from './renew-list.component';

describe('RenewMandateListComponent', () => {
  let component: RenewMandateListComponent;
  let fixture: ComponentFixture<RenewMandateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewMandateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewMandateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

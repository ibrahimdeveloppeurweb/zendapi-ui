import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCommitteeComponent } from './owner-committee.component';

describe('OwnerCommitteeComponent', () => {
  let component: OwnerCommitteeComponent;
  let fixture: ComponentFixture<OwnerCommitteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerCommitteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

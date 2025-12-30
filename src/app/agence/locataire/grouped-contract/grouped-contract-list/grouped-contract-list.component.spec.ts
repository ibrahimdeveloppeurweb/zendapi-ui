import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedContractListComponent } from './grouped-contract-list.component';

describe('GroupedContractListComponent', () => {
  let component: GroupedContractListComponent;
  let fixture: ComponentFixture<GroupedContractListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedContractListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

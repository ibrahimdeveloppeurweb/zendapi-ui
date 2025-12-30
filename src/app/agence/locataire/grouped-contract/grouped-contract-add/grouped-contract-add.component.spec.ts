import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {GroupedContractAddComponent} from './grouped-contract-add.component';

describe('GroupedContractAddComponent', () => {
  let component: GroupedContractAddComponent;
  let fixture: ComponentFixture<GroupedContractAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedContractAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedContractAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

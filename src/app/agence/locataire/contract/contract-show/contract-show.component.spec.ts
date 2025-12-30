import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractShowComponent } from './contract-show.component';

describe('ContractShowComponent', () => {
  let component: ContractShowComponent;
  let fixture: ComponentFixture<ContractShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

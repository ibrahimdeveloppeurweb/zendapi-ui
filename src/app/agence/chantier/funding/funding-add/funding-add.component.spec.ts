import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingAddComponent } from './funding-add.component';

describe('FundingAddComponent', () => {
  let component: FundingAddComponent;
  let fixture: ComponentFixture<FundingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundRequestAddComponent } from './fund-request-add.component';

describe('FundRequestAddComponent', () => {
  let component: FundRequestAddComponent;
  let fixture: ComponentFixture<FundRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundRequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

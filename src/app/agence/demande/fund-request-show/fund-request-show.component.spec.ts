import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundRequestShowComponent } from './fund-request-show.component';

describe('FundRequestShowComponent', () => {
  let component: FundRequestShowComponent;
  let fixture: ComponentFixture<FundRequestShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundRequestShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundRequestShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingShowComponent } from './funding-show.component';

describe('FundingShowComponent', () => {
  let component: FundingShowComponent;
  let fixture: ComponentFixture<FundingShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

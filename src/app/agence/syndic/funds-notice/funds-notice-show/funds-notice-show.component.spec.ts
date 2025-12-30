import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsNoticeShowComponent } from './funds-notice-show.component';

describe('FundsNoticeShowComponent', () => {
  let component: FundsNoticeShowComponent;
  let fixture: ComponentFixture<FundsNoticeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsNoticeShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsNoticeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

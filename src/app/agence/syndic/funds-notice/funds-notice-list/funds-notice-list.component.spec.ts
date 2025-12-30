import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsNoticeListComponent } from './funds-notice-list.component';

describe('FundsNoticeListComponent', () => {
  let component: FundsNoticeListComponent;
  let fixture: ComponentFixture<FundsNoticeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsNoticeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsNoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

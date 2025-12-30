import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeShowComponent } from './notice-show.component';

describe('NoticeShowComponent', () => {
  let component: NoticeShowComponent;
  let fixture: ComponentFixture<NoticeShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

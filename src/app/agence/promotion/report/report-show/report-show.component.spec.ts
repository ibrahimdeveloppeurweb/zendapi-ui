import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportShowComponent } from './report-show.component';

describe('ReportShowComponent', () => {
  let component: ReportShowComponent;
  let fixture: ComponentFixture<ReportShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DxGanttComponent } from './dx-gantt.component';

describe('DxGanttComponent', () => {
  let component: DxGanttComponent;
  let fixture: ComponentFixture<DxGanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DxGanttComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DxGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

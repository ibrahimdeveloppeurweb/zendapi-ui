import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutilGanttComponent } from './outil-gantt.component';

describe('OutilGanttComponent', () => {
  let component: OutilGanttComponent;
  let fixture: ComponentFixture<OutilGanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutilGanttComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutilGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashViewerComponent } from './dash-viewer.component';

describe('DashViewerComponent', () => {
  let component: DashViewerComponent;
  let fixture: ComponentFixture<DashViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

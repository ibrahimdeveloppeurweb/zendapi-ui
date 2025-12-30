import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksiteShowComponent } from './worksite-show.component';

describe('WorksiteShowComponent', () => {
  let component: WorksiteShowComponent;
  let fixture: ComponentFixture<WorksiteShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksiteShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksiteShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

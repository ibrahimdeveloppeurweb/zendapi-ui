import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksiteListComponent } from './worksite-list.component';

describe('WorksiteListComponent', () => {
  let component: WorksiteListComponent;
  let fixture: ComponentFixture<WorksiteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksiteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

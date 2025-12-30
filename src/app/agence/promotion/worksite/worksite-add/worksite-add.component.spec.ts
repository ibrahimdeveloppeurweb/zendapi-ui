import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksiteAddComponent } from './worksite-add.component';

describe('WorksiteAddComponent', () => {
  let component: WorksiteAddComponent;
  let fixture: ComponentFixture<WorksiteAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksiteAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksiteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

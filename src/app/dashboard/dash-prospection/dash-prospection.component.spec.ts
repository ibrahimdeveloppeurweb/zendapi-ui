import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashProspectionComponent } from './dash-prospection.component';

describe('DashProspectionComponent', () => {
  let component: DashProspectionComponent;
  let fixture: ComponentFixture<DashProspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashProspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashProspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

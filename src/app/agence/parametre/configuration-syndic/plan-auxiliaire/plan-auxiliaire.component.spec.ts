import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAuxiliaireComponent } from './plan-auxiliaire.component';

describe('PlanAuxiliaireComponent', () => {
  let component: PlanAuxiliaireComponent;
  let fixture: ComponentFixture<PlanAuxiliaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanAuxiliaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAuxiliaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

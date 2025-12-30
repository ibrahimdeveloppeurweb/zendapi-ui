import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComptableListComponent } from './plan-comptable-list.component';

describe('PlanComptableListComponent', () => {
  let component: PlanComptableListComponent;
  let fixture: ComponentFixture<PlanComptableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanComptableListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComptableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

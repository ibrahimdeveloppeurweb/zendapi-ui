import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectionAddComponent } from './prospection-add.component';

describe('ProspectionAddComponent', () => {
  let component: ProspectionAddComponent;
  let fixture: ComponentFixture<ProspectionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

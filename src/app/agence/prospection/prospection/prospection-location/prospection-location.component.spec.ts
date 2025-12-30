import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectionLocationComponent } from './prospection-location.component';

describe('ProspectionLocationComponent', () => {
  let component: ProspectionLocationComponent;
  let fixture: ComponentFixture<ProspectionLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectionLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectionLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

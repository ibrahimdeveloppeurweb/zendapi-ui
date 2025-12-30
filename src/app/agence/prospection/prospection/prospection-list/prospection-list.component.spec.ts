import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectionListComponent } from './prospection-list.component';

describe('ProspectionListComponent', () => {
  let component: ProspectionListComponent;
  let fixture: ComponentFixture<ProspectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

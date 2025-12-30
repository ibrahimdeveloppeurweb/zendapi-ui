import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectionShowComponent } from './prospection-show.component';

describe('ProspectionShowComponent', () => {
  let component: ProspectionShowComponent;
  let fixture: ComponentFixture<ProspectionShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectionShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

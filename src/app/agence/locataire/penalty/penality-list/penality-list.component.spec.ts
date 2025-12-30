import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenalityListComponent } from './penality-list.component';

describe('PenalityListComponent', () => {
  let component: PenalityListComponent;
  let fixture: ComponentFixture<PenalityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenalityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenalityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

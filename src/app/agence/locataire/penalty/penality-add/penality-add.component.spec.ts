import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenalityAddComponent } from './penality-add.component';

describe('PenalityAddComponent', () => {
  let component: PenalityAddComponent;
  let fixture: ComponentFixture<PenalityAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenalityAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenalityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

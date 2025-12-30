import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyShowComponent } from './penality-show.component';

describe('PenaltyShowComponent', () => {
  let component: PenaltyShowComponent;
  let fixture: ComponentFixture<PenaltyShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenaltyShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenaltyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

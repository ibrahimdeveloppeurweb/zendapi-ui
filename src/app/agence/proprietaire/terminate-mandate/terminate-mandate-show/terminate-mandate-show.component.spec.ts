import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateMandateShowComponent } from './terminate-mandate-show.component';

describe('TerminateMandateShowComponent', () => {
  let component: TerminateMandateShowComponent;
  let fixture: ComponentFixture<TerminateMandateShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminateMandateShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateMandateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

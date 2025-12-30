import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateMandateAddComponent } from './terminate-mandate-add.component';

describe('TerminateMandateAddComponent', () => {
  let component: TerminateMandateAddComponent;
  let fixture: ComponentFixture<TerminateMandateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminateMandateAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateMandateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

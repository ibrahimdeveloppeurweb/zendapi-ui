import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateShowComponent } from './mandate-show.component';

describe('MandateShowComponent', () => {
  let component: MandateShowComponent;
  let fixture: ComponentFixture<MandateShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

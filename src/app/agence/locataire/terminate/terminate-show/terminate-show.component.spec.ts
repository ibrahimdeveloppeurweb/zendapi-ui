import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateShowComponent } from './terminate-show.component';

describe('TerminateShowComponent', () => {
  let component: TerminateShowComponent;
  let fixture: ComponentFixture<TerminateShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminateShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

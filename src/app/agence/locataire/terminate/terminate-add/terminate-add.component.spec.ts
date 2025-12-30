import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateAddComponent } from './terminate-add.component';

describe('TerminateAddComponent', () => {
  let component: TerminateAddComponent;
  let fixture: ComponentFixture<TerminateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

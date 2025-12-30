import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateListComponent } from './terminate-list.component';

describe('TerminateListComponent', () => {
  let component: TerminateListComponent;
  let fixture: ComponentFixture<TerminateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

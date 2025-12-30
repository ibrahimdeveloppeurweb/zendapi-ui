import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateMandateListComponent } from './terminate-mandate-list.component';

describe('TerminateMandateListComponent', () => {
  let component: TerminateMandateListComponent;
  let fixture: ComponentFixture<TerminateMandateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminateMandateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateMandateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

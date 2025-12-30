import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignationTicketComponent } from './assignation-ticket.component';

describe('AssignationTicketComponent', () => {
  let component: AssignationTicketComponent;
  let fixture: ComponentFixture<AssignationTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignationTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignationTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

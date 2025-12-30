import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashTicketComponent } from './dash-ticket.component';

describe('DashTicketComponent', () => {
  let component: DashTicketComponent;
  let fixture: ComponentFixture<DashTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

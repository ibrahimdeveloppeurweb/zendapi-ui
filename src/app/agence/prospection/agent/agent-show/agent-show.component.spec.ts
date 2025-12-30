import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentShowComponent } from './agent-show.component';

describe('AgentShowComponent', () => {
  let component: AgentShowComponent;
  let fixture: ComponentFixture<AgentShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

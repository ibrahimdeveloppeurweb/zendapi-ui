import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureItemComponent } from './procedure-item.component';

describe('ProcedureItemComponent', () => {
  let component: ProcedureItemComponent;
  let fixture: ComponentFixture<ProcedureItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedureItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

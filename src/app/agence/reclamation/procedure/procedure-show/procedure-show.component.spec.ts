import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureShowComponent } from './procedure-show.component';

describe('ProcedureShowComponent', () => {
  let component: ProcedureShowComponent;
  let fixture: ComponentFixture<ProcedureShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedureShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

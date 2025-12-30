import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthCodeComptableComponent } from './length-code-comptable.component';

describe('LengthCodeComptableComponent', () => {
  let component: LengthCodeComptableComponent;
  let fixture: ComponentFixture<LengthCodeComptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LengthCodeComptableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthCodeComptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

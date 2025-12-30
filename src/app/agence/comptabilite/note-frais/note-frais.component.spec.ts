import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFraisComponent } from './note-frais.component';

describe('NoteFraisComponent', () => {
  let component: NoteFraisComponent;
  let fixture: ComponentFixture<NoteFraisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteFraisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondominiumAddComponent } from './condominium-add.component';

describe('CondominiumAddComponent', () => {
  let component: CondominiumAddComponent;
  let fixture: ComponentFixture<CondominiumAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondominiumAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CondominiumAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

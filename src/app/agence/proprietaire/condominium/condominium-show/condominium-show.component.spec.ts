import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondominiumShowComponent } from './condominium-show.component';

describe('CondominiumShowComponent', () => {
  let component: CondominiumShowComponent;
  let fixture: ComponentFixture<CondominiumShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondominiumShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CondominiumShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

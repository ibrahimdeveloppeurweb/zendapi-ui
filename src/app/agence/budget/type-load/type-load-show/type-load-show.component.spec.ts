import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeLoadShowComponent } from './type-load-show.component';

describe('TypeLoadShowComponent', () => {
  let component: TypeLoadShowComponent;
  let fixture: ComponentFixture<TypeLoadShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeLoadShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeLoadShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

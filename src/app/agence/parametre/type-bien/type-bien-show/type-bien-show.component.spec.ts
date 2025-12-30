import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeBienShowComponent } from './type-bien-show.component';

describe('TypeBienShowComponent', () => {
  let component: TypeBienShowComponent;
  let fixture: ComponentFixture<TypeBienShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeBienShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeBienShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

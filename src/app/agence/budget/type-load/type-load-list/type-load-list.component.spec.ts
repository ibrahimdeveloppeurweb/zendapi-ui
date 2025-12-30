import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeLoadListComponent } from './type-load-list.component';

describe('TypeLoadListComponent', () => {
  let component: TypeLoadListComponent;
  let fixture: ComponentFixture<TypeLoadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeLoadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeLoadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

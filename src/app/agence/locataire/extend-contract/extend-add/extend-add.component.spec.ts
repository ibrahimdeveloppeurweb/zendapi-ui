import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendAddComponent } from './extend-add.component';

describe('ExtendAddComponent', () => {
  let component: ExtendAddComponent;
  let fixture: ComponentFixture<ExtendAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImgComponent } from './user-img.component';

describe('UserImgComponent', () => {
  let component: UserImgComponent;
  let fixture: ComponentFixture<UserImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

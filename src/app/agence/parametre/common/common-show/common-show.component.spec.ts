import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonShowComponent } from './common-show.component';

describe('CommonShowComponent', () => {
  let component: CommonShowComponent;
  let fixture: ComponentFixture<CommonShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

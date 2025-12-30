import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAddComponent } from './common-add.component';

describe('CommonAddComponent', () => {
  let component: CommonAddComponent;
  let fixture: ComponentFixture<CommonAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

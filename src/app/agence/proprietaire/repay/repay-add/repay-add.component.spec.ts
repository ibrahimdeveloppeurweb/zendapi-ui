import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepayAddComponent } from './repay-add.component';

describe('RepayAddComponent', () => {
  let component: RepayAddComponent;
  let fixture: ComponentFixture<RepayAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepayAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

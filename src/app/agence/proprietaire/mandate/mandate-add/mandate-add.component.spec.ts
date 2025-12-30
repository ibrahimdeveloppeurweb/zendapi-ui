import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateAddComponent } from './mandate-add.component';

describe('MandateAddComponent', () => {
  let component: MandateAddComponent;
  let fixture: ComponentFixture<MandateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

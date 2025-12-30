import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAddComponent } from './general-add.component';

describe('GeneralAddComponent', () => {
  let component: GeneralAddComponent;
  let fixture: ComponentFixture<GeneralAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

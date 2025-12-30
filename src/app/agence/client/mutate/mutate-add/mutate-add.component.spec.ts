import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutateAddComponent } from './mutate-add.component';

describe('MutateAddComponent', () => {
  let component: MutateAddComponent;
  let fixture: ComponentFixture<MutateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

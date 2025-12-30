import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutateShowComponent } from './mutate-show.component';

describe('MutateShowComponent', () => {
  let component: MutateShowComponent;
  let fixture: ComponentFixture<MutateShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutateShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

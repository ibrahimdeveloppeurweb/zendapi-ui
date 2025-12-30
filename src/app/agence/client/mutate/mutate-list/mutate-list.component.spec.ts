import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutateListComponent } from './mutate-list.component';

describe('MutateListComponent', () => {
  let component: MutateListComponent;
  let fixture: ComponentFixture<MutateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

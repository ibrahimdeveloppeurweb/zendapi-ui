import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTypeListComponent } from './home-type-list.component';

describe('HomeTypeListComponent', () => {
  let component: HomeTypeListComponent;
  let fixture: ComponentFixture<HomeTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

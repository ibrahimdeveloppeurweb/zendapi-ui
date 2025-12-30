import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeShowComponent } from './home-show.component';

describe('HomeShowComponent', () => {
  let component: HomeShowComponent;
  let fixture: ComponentFixture<HomeShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

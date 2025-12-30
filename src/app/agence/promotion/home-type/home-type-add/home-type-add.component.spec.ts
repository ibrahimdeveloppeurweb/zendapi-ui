import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTypeAddComponent } from './home-type-add.component';

describe('HomeTypeAddComponent', () => {
  let component: HomeTypeAddComponent;
  let fixture: ComponentFixture<HomeTypeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTypeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

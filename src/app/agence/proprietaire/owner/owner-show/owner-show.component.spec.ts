import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowComponent } from './owner-show.component';

describe('OwnerShowComponent', () => {
  let component: OwnerShowComponent;
  let fixture: ComponentFixture<OwnerShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

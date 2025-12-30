import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCoShowComponent } from './owner-co-show.component';

describe('OwnerCoShowComponent', () => {
  let component: OwnerCoShowComponent;
  let fixture: ComponentFixture<OwnerCoShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerCoShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerCoShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

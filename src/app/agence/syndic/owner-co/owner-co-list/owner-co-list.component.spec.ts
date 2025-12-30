import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCoListComponent } from './owner-co-list.component';

describe('OwnerCoListComponent', () => {
  let component: OwnerCoListComponent;
  let fixture: ComponentFixture<OwnerCoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerCoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerCoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

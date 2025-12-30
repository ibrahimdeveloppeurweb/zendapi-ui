import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCoAddComponent } from './owner-co-add.component';

describe('OwnerCoAddComponent', () => {
  let component: OwnerCoAddComponent;
  let fixture: ComponentFixture<OwnerCoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerCoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerCoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

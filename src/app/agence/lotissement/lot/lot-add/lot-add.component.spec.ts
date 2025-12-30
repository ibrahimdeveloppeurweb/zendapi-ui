import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotAddComponent } from './lot-add.component';

describe('LotAddComponent', () => {
  let component: LotAddComponent;
  let fixture: ComponentFixture<LotAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

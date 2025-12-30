import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotShowComponent } from './lot-show.component';

describe('LotShowComponent', () => {
  let component: LotShowComponent;
  let fixture: ComponentFixture<LotShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

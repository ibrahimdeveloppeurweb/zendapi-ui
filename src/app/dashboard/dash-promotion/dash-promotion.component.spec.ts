import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPromotionComponent } from './dash-promotion.component';

describe('DashPromotionComponent', () => {
  let component: DashPromotionComponent;
  let fixture: ComponentFixture<DashPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

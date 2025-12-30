import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionShowComponent } from './promotion-show.component';

describe('PromotionShowComponent', () => {
  let component: PromotionShowComponent;
  let fixture: ComponentFixture<PromotionShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

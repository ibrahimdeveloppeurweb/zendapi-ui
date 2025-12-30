import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondominiumShowItemComponent } from './condominium-show-item.component';

describe('CondominiumShowItemComponent', () => {
  let component: CondominiumShowItemComponent;
  let fixture: ComponentFixture<CondominiumShowItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CondominiumShowItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CondominiumShowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

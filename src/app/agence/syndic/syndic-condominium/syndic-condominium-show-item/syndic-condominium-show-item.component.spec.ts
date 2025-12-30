import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicCondominiumShowItemComponent } from './syndic-condominium-show-item.component';

describe('SyndicCondominiumShowItemComponent', () => {
  let component: SyndicCondominiumShowItemComponent;
  let fixture: ComponentFixture<SyndicCondominiumShowItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicCondominiumShowItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicCondominiumShowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

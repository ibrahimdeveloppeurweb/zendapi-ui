import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicCondominiumShowComponent } from './syndic-condominium-show.component';

describe('SyndicCondominiumShowComponent', () => {
  let component: SyndicCondominiumShowComponent;
  let fixture: ComponentFixture<SyndicCondominiumShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicCondominiumShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicCondominiumShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

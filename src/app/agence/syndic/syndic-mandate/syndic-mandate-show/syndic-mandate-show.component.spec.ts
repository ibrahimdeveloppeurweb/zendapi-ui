import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicMandateShowComponent } from './syndic-mandate-show.component';

describe('SyndicMandateShowComponent', () => {
  let component: SyndicMandateShowComponent;
  let fixture: ComponentFixture<SyndicMandateShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicMandateShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicMandateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

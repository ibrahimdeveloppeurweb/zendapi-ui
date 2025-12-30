import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicShowComponent } from './syndic-show.component';

describe('SyndicShowComponent', () => {
  let component: SyndicShowComponent;
  let fixture: ComponentFixture<SyndicShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

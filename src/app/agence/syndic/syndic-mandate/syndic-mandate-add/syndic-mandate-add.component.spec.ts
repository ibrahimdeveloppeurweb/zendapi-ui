import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicMandateAddComponent } from './syndic-mandate-add.component';

describe('SyndicMandateAddComponent', () => {
  let component: SyndicMandateAddComponent;
  let fixture: ComponentFixture<SyndicMandateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicMandateAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicMandateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

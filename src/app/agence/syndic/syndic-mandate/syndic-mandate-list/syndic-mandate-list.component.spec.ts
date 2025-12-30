import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicMandateListComponent } from './syndic-mandate-list.component';

describe('SyndicMandateListComponent', () => {
  let component: SyndicMandateListComponent;
  let fixture: ComponentFixture<SyndicMandateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicMandateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicMandateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicListComponent } from './syndic-list.component';

describe('SyndicListComponent', () => {
  let component: SyndicListComponent;
  let fixture: ComponentFixture<SyndicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

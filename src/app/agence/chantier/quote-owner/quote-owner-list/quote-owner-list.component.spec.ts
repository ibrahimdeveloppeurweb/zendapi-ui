import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOwnerListComponent } from './quote-owner-list.component';

describe('QuoteOwnerListComponent', () => {
  let component: QuoteOwnerListComponent;
  let fixture: ComponentFixture<QuoteOwnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteOwnerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOwnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

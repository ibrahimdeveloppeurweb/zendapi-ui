import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOwnerShowComponent } from './quote-owner-show.component';

describe('QuoteOwnerShowComponent', () => {
  let component: QuoteOwnerShowComponent;
  let fixture: ComponentFixture<QuoteOwnerShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteOwnerShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOwnerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

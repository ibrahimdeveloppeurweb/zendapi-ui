import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOwnerAddComponent } from './quote-owner-add.component';

describe('QuoteOwnerAddComponent', () => {
  let component: QuoteOwnerAddComponent;
  let fixture: ComponentFixture<QuoteOwnerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteOwnerAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOwnerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

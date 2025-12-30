import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsApealsShowComponent } from './funds-apeals-show.component';

describe('FundsApealsShowComponent', () => {
  let component: FundsApealsShowComponent;
  let fixture: ComponentFixture<FundsApealsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsApealsShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsApealsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryShowComponent } from './country-show.component';

describe('CountryShowComponent', () => {
  let component: CountryShowComponent;
  let fixture: ComponentFixture<CountryShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

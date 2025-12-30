import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournauxShowComponent } from './journaux-show.component';

describe('JournauxShowComponent', () => {
  let component: JournauxShowComponent;
  let fixture: ComponentFixture<JournauxShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournauxShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournauxShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

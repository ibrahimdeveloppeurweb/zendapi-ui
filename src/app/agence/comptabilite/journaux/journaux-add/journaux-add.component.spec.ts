import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournauxAddComponent } from './journaux-add.component';

describe('JournauxAddComponent', () => {
  let component: JournauxAddComponent;
  let fixture: ComponentFixture<JournauxAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournauxAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournauxAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

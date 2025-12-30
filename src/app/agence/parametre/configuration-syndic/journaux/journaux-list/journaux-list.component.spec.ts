import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournauxListComponent } from './journaux-list.component';

describe('JournauxListComponent', () => {
  let component: JournauxListComponent;
  let fixture: ComponentFixture<JournauxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournauxListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournauxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

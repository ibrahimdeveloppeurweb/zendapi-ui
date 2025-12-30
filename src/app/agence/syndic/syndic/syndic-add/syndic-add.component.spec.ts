import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicAddComponent } from './syndic-add.component';

describe('SyndicAddComponent', () => {
  let component: SyndicAddComponent;
  let fixture: ComponentFixture<SyndicAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

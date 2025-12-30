import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateUploadComponent } from './mandate-upload.component';

describe('MandateUploadComponent', () => {
  let component: MandateUploadComponent;
  let fixture: ComponentFixture<MandateUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MandateUploadComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

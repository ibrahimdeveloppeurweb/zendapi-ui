import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderUpload2Component } from './folder-upload-2.component';

describe('FolderUpload2Component', () => {
  let component: FolderUpload2Component;
  let fixture: ComponentFixture<FolderUpload2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderUpload2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderUpload2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

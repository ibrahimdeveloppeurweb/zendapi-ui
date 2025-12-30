import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderUploaderComponent } from './folder-uploader.component';

describe('FolderUploaderComponent', () => {
  let component: FolderUploaderComponent;
  let fixture: ComponentFixture<FolderUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderTerminateAddComponent } from './folder-terminate-add.component';

describe('FolderTerminateAddComponent', () => {
  let component: FolderTerminateAddComponent;
  let fixture: ComponentFixture<FolderTerminateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderTerminateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderTerminateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

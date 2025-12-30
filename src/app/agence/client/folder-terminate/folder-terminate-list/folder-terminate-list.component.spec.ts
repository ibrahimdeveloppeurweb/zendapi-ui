import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderTerminateListComponent } from './folder-terminate-list.component';

describe('FolderTerminateListComponent', () => {
  let component: FolderTerminateListComponent;
  let fixture: ComponentFixture<FolderTerminateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderTerminateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderTerminateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderTerminateShowComponent } from './folder-terminate-show.component';

describe('FolderTerminateShowComponent', () => {
  let component: FolderTerminateShowComponent;
  let fixture: ComponentFixture<FolderTerminateShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderTerminateShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderTerminateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

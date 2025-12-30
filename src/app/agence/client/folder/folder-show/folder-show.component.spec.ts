import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderShowComponent } from './folder-show.component';

describe('FolderShowComponent', () => {
  let component: FolderShowComponent;
  let fixture: ComponentFixture<FolderShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

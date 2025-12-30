import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationShowComponent } from './qualification-show.component';

describe('QualificationShowComponent', () => {
  let component: QualificationShowComponent;
  let fixture: ComponentFixture<QualificationShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

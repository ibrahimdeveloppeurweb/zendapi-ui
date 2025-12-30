import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantShowComponent } from './tenant-show.component';

describe('TenantShowComponent', () => {
  let component: TenantShowComponent;
  let fixture: ComponentFixture<TenantShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

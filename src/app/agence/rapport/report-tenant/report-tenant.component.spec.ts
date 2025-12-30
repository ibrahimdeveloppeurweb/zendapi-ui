import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTenantComponent } from './report-tenant.component';

describe('ReportTenantComponent', () => {
  let component: ReportTenantComponent;
  let fixture: ComponentFixture<ReportTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTenantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

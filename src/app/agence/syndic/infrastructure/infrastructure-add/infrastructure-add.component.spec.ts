import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureAddComponent } from './infrastructure-add.component';

describe('InfrastructureAddComponent', () => {
  let component: InfrastructureAddComponent;
  let fixture: ComponentFixture<InfrastructureAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

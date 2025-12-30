import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureShowComponent } from './infrastructure-show.component';

describe('InfrastructureShowComponent', () => {
  let component: InfrastructureShowComponent;
  let fixture: ComponentFixture<InfrastructureShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyndicCondominiumListComponent } from './syndic-condominium-list.component';

describe('SyndicCondominiumListComponent', () => {
  let component: SyndicCondominiumListComponent;
  let fixture: ComponentFixture<SyndicCondominiumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyndicCondominiumListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyndicCondominiumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

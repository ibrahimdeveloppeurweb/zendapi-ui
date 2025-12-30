import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityFinderComponent } from './entity-finder.component';


describe('EntityFinderComponent', () => {
  let component: EntityFinderComponent;
  let fixture: ComponentFixture<EntityFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

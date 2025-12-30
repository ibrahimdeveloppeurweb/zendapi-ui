import { TestBed } from '@angular/core/testing';
import { RendService } from './rend.service';


describe('RendService', () => {
  let service: RendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

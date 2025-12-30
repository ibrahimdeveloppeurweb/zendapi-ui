import { TestBed } from '@angular/core/testing';

import { FolderTerminateService } from './folder-terminate.service';

describe('FolderTerminateService', () => {
  let service: FolderTerminateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolderTerminateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

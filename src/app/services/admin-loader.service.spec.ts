import { TestBed } from '@angular/core/testing';

import { AdminLoaderService } from './admin-loader.service';

describe('AdminLoaderService', () => {
  let service: AdminLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

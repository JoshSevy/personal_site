import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { trailingSlashGuard } from './trailing-slash.guard';

describe('trailingSlashGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => trailingSlashGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

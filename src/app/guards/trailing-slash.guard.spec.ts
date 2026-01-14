import { TestBed } from '@angular/core/testing';

import { TrailingSlashGuard } from './trailing-slash.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('TrailingSlashGuard', () => {
  let guard: TrailingSlashGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    guard = TestBed.inject(TrailingSlashGuard as any);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

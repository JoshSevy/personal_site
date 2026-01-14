import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [BlogService]
    });
    service = TestBed.inject(BlogService as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

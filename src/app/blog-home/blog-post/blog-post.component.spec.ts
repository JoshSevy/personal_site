import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { BlogPostComponent } from './blog-post.component';
import { BlogService } from '../services/blog.service';

const blogServiceStub = {
  getPostById: (id: string) => of({ id, title: 't', content: 'c', author: 'a' })
};

const activatedRouteStub: Partial<ActivatedRoute> = {
  snapshot: { paramMap: { get: (k: string) => '1' } } as any
};

describe('BlogPostComponent', () => {
  let component: BlogPostComponent;
  let fixture: ComponentFixture<BlogPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

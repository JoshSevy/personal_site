import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

import { BlogPostComponent } from './blog-post.component';
import { BlogService } from '../services/blog.service';
import { SeoService } from '../../services/seo.service';
import { BlogPost } from '../blog-post.model';

const sample: BlogPost = {
  id: '1',
  slug: 'hello',
  title: 'Hello',
  excerpt: 'Hi',
  content: '# Hi',
  author: 'Me',
  publishDate: '2024-01-01',
  published: true,
  tags: [],
};

const blogServiceStub = {
  getPostById: () => of(sample),
  getPostBySlug: () => of(sample),
};

const activatedRouteStub: Partial<ActivatedRoute> = {
  paramMap: of(convertToParamMap({ slug: 'hello' })),
  snapshot: {
    paramMap: convertToParamMap({ slug: 'hello' }),
  } as ActivatedRoute['snapshot'],
};

const routerStub: Partial<Router> = {
  navigate: () => Promise.resolve(true),
};

const seoStub: Partial<SeoService> = {
  updateMetaTags: () => {},
  addArticleStructuredData: () => {},
};

describe('BlogPostComponent', () => {
  let component: BlogPostComponent;
  let fixture: ComponentFixture<BlogPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: SeoService, useValue: seoStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

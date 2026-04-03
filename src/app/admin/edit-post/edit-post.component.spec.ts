import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { EditPostComponent } from './edit-post.component';
import { BlogStore } from '../../blog-home/state/blog.store';
import { SupabaseService } from '../../services/supabase.service';
import { BlogPost } from '../../blog-home/blog-post.model';

const samplePost: BlogPost = {
  id: '1',
  slug: 'test-post',
  title: 'Test',
  excerpt: '',
  content: 'Hello',
  author: 'Me',
  publishDate: '2024-01-01',
  published: true,
  tags: ['a'],
};

const blogStoreStub = {
  fetchPostById: () => of(samplePost),
  updatePost: () => of({}),
};

const activatedRouteStub: Partial<ActivatedRoute> = {
  snapshot: { paramMap: { get: () => '1' } } as unknown as ActivatedRoute['snapshot'],
};

const routerStub: Partial<Router> = {
  navigate: () => Promise.resolve(true),
};

const supabaseStub = {
  uploadBlogHeroImage: async () => null as string | null,
};

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostComponent],
      providers: [
        { provide: BlogStore, useValue: blogStoreStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: SupabaseService, useValue: supabaseStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

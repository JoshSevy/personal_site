import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';

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
        // RouterLink in the template subscribes to Router.events, so it needs
        // a real Router rather than a navigate-only stub.
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
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

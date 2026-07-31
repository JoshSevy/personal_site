import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
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

const activatedRouteStub: Partial<ActivatedRoute> = {
  snapshot: { paramMap: { get: () => '1' } } as unknown as ActivatedRoute['snapshot'],
};

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let fetchPostById$: Subject<BlogPost | null>;
  let supabaseStub: { uploadBlogHeroImage: (file: File) => Promise<string | null> };

  async function setup() {
    fetchPostById$ = new Subject<BlogPost | null>();
    supabaseStub = { uploadBlogHeroImage: async () => null };

    await TestBed.configureTestingModule({
      imports: [EditPostComponent],
      providers: [
        { provide: BlogStore, useValue: { fetchPostById: () => fetchPostById$, updatePost: () => ({ subscribe: () => undefined }) } },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SupabaseService, useValue: supabaseStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('renders the form once the post arrives after the initial render', async () => {
    await setup();
    // fetchPostById resolves asynchronously here, unlike a synchronous of()
    // stub, which would resolve before the first detectChanges() and mask
    // the bug this guards against: post used to be a plain field, so under
    // OnPush a subscribe callback firing after the initial render would
    // update state but never schedule the re-render that shows it.
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Loading post');

    fetchPostById$.next(samplePost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = (fixture.nativeElement as HTMLElement).querySelector('#title') as HTMLInputElement;
    expect(input?.value).toBe('Test');
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Loading post');
  });

  it('reflects a hero image upload that resolves after the post has loaded', async () => {
    await setup();
    fetchPostById$.next(samplePost);
    fixture.detectChanges();

    supabaseStub.uploadBlogHeroImage = async () => 'https://example.com/hero.png';
    const file = new File(['x'], 'hero.png', { type: 'image/png' });
    await component.onHeroFile({ target: { files: [file], value: '' } } as unknown as Event);
    fixture.detectChanges();

    const img = (fixture.nativeElement as HTMLElement).querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/hero.png');
    expect(component.uploading()).toBe(false);
  });
});

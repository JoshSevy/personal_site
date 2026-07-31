import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { AddPostComponent } from './add-post.component';
import { BlogStore } from '../../blog-home/state/blog.store';
import { SupabaseService } from '../../services/supabase.service';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let supabaseStub: { uploadBlogHeroImage: (file: File) => Promise<string | null> };

  const blogStoreStub = {
    createPost: () => of({}),
  };

  beforeEach(async () => {
    supabaseStub = { uploadBlogHeroImage: async () => null };

    await TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [
        provideRouter([]),
        { provide: BlogStore, useValue: blogStoreStub },
        { provide: SupabaseService, useValue: supabaseStub },
      ],
    }).compileComponents();

    (window as unknown as { alert: () => void }).alert = () => {};

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reflects a hero image upload in the DOM once it resolves', async () => {
    // uploadBlogHeroImage resolves after an `await` inside onHeroFile, which
    // is invoked from a template (change) handler. That's outside the
    // synchronous window Angular uses to decide whether to refresh an OnPush
    // component, so uploading/uploadError/heroImageUrl have to be signals.
    supabaseStub.uploadBlogHeroImage = async () => 'https://example.com/hero.png';
    const file = new File(['x'], 'hero.png', { type: 'image/png' });

    const uploadPromise = component.onHeroFile({ target: { files: [file], value: '' } } as unknown as Event);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Uploading');

    await uploadPromise;
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toContain('Uploading');
    expect(text).toContain('https://example.com/hero.png');
    const img = (fixture.nativeElement as HTMLElement).querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.com/hero.png');
  });

  it('shows an upload error in the DOM', async () => {
    supabaseStub.uploadBlogHeroImage = async () => {
      throw new Error('network down');
    };
    const file = new File(['x'], 'hero.png', { type: 'image/png' });

    await component.onHeroFile({ target: { files: [file], value: '' } } as unknown as Event);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('network down');
  });
});

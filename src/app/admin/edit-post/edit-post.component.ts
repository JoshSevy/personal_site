import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogStore } from '../../blog-home/state/blog.store';
import { BlogPost } from '../../blog-home/blog-post.model';
import { MarkdownEditorComponent } from '../../editor/markdown-editor.component';
import { SupabaseService } from '../../services/supabase.service';
import { slugify } from '../../utils/slugify';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [FormsModule, MarkdownEditorComponent, RouterLink],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  // Loaded inside a BlogStore subscribe callback, which resolves outside any
  // template event or existing signal write. Needs to be a signal for the
  // null -> loaded transition to reach the DOM under OnPush.
  readonly post = signal<BlogPost | null>(null);
  slugManual = '';
  slugTouched = false;
  tagsInput = '';
  readonly uploading = signal(false);
  readonly uploadError = signal<string | null>(null);

  constructor(
    private blogStore: BlogStore,
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService
  ) {}

  slugifyPreview = slugify;

  get slug(): string {
    const manual = this.slugManual.trim();
    if (manual) {
      return slugify(manual);
    }
    const post = this.post();
    return post ? slugify(post.title) : '';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/admin/posts']);
      return;
    }

    this.blogStore.fetchPostById(id).subscribe((p) => {
      if (!p) {
        void this.router.navigate(['/admin/posts']);
        return;
      }
      // slugManual/slugTouched/tagsInput are plain fields, but that's safe:
      // they're only read inside the `@if (post(); as p)` block, and the
      // post.set() call right below triggers the CD pass that picks them
      // all up together.
      this.slugManual = p.slug;
      this.slugTouched = true;
      this.tagsInput = (p.tags ?? []).join(', ');
      this.post.set({ ...p });
    });
  }

  onTitleChange(): void {
    const post = this.post();
    if (!this.slugTouched && post) {
      this.slugManual = slugify(post.title);
    }
  }

  parseTags(): string[] {
    return this.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async onHeroFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.post()) {
      return;
    }
    this.uploading.set(true);
    this.uploadError.set(null);
    try {
      const url = await this.supabase.uploadBlogHeroImage(file);
      if (url) {
        this.post.update((p) => (p ? { ...p, heroImageUrl: url } : p));
      } else {
        this.uploadError.set(
          'Image upload is disabled (set SUPABASE_BLOG_IMAGES_BUCKET) or upload failed.',
        );
      }
    } catch (e: unknown) {
      this.uploadError.set(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      this.uploading.set(false);
      input.value = '';
    }
  }

  updatePost() {
    const id = this.route.snapshot.paramMap.get('id');
    const post = this.post();
    if (!id || !post) {
      return;
    }
    const s = this.slug;
    if (!post.title.trim() || !s || !post.content.trim()) {
      alert('Title, slug, and content are required.');
      return;
    }

    this.blogStore
      .updatePost(id, {
        title: post.title.trim(),
        slug: s,
        content: post.content,
        excerpt: post.excerpt.trim() || undefined,
        author: post.author.trim() || undefined,
        published: post.published,
        tags: this.parseTags().length ? this.parseTags() : undefined,
        hero_image_url: post.heroImageUrl?.trim() || undefined,
      })
      .subscribe({
        next: () => void this.router.navigate(['/admin/posts']),
        error: (err: unknown) => {
          console.error(err);
          alert('Could not update post. Check the GraphQL API schema.');
        },
      });
  }
}

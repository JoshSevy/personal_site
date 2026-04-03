import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogStore } from '../../blog-home/state/blog.store';
import { MarkdownEditorComponent } from '../../editor/markdown-editor.component';
import { SupabaseService } from '../../services/supabase.service';
import { slugify } from '../../utils/slugify';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [FormsModule, MarkdownEditorComponent, RouterLink],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent {
  title = '';
  slugManual = '';
  slugTouched = false;
  excerpt = '';
  content = '';
  author = '';
  tagsInput = '';
  published = false;
  heroImageUrl = '';
  uploading = false;
  uploadError: string | null = null;

  /** For template placeholder preview */
  slugifyPreview = slugify;

  constructor(
    private blogStore: BlogStore,
    private router: Router,
    private supabase: SupabaseService
  ) {}

  get slug(): string {
    const manual = this.slugManual.trim();
    if (manual) {
      return slugify(manual);
    }
    return slugify(this.title);
  }

  onTitleChange(): void {
    if (!this.slugTouched) {
      this.slugManual = '';
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
    if (!file) {
      return;
    }
    this.uploading = true;
    this.uploadError = null;
    try {
      const url = await this.supabase.uploadBlogHeroImage(file);
      if (url) {
        this.heroImageUrl = url;
      } else {
        this.uploadError =
          'Image upload is disabled (set SUPABASE_BLOG_IMAGES_BUCKET) or upload failed.';
      }
    } catch (e: unknown) {
      this.uploadError = e instanceof Error ? e.message : 'Upload failed';
    } finally {
      this.uploading = false;
      input.value = '';
    }
  }

  createPost() {
    const s = this.slug;
    if (!this.title.trim() || !s || !this.content.trim()) {
      alert('Title, slug (from title), and content are required.');
      return;
    }

    this.blogStore
      .createPost({
        title: this.title.trim(),
        slug: s,
        content: this.content,
        excerpt: this.excerpt.trim() || undefined,
        author: this.author.trim() || undefined,
        published: this.published,
        tags: this.parseTags().length ? this.parseTags() : undefined,
        hero_image_url: this.heroImageUrl.trim() || undefined,
      })
      .subscribe({
        next: () => void this.router.navigate(['/admin/posts']),
        error: (err: unknown) => {
          console.error(err);
          alert('Could not create post. Check the GraphQL API matches the new schema (slug, published, etc.).');
        },
      });
  }
}

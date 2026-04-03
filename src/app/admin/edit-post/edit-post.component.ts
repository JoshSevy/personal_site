import { Component, OnInit } from '@angular/core';
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
  post: BlogPost | null = null;
  slugManual = '';
  slugTouched = false;
  tagsInput = '';
  uploading = false;
  uploadError: string | null = null;

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
    return this.post ? slugify(this.post.title) : '';
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
      this.post = { ...p };
      this.slugManual = p.slug;
      this.slugTouched = true;
      this.tagsInput = (p.tags ?? []).join(', ');
    });
  }

  onTitleChange(): void {
    if (!this.slugTouched && this.post) {
      this.slugManual = slugify(this.post.title);
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
    if (!file || !this.post) {
      return;
    }
    this.uploading = true;
    this.uploadError = null;
    try {
      const url = await this.supabase.uploadBlogHeroImage(file);
      if (url) {
        this.post.heroImageUrl = url;
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

  updatePost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || !this.post) {
      return;
    }
    const s = this.slug;
    if (!this.post.title.trim() || !s || !this.post.content.trim()) {
      alert('Title, slug, and content are required.');
      return;
    }

    this.blogStore
      .updatePost(id, {
        title: this.post.title.trim(),
        slug: s,
        content: this.post.content,
        excerpt: this.post.excerpt.trim() || undefined,
        author: this.post.author.trim() || undefined,
        published: this.post.published,
        tags: this.parseTags().length ? this.parseTags() : undefined,
        hero_image_url: this.post.heroImageUrl?.trim() || undefined,
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

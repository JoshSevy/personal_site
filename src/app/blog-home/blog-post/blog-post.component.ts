import { Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { MarkdownToHtmlPipe } from '../../pipes/markdown-to-html.pipe';
import { HighlightCodeDirective } from '../../directives/highlight-syntax.directive';
import { SeoService } from '../../services/seo.service';
import { BlogStore } from '../state/blog.store';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [DatePipe, MarkdownToHtmlPipe, HighlightCodeDirective, RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit {
  readonly blogStore = inject(BlogStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const post = this.blogStore.postBySlug();
      if (!post) return;
      const base = 'https://www.joshuasevy.com';
      this.seo.updateMetaTags({
        title: post.title,
        description: post.excerpt || post.title,
        url: `${base}/blog/${post.slug}`,
        image: post.heroImageUrl,
        type: 'article',
      });
      this.seo.addArticleStructuredData({
        headline: post.title,
        description: post.excerpt || post.title,
        image: post.heroImageUrl || `${base}/manifest.json`,
        datePublished: post.publishDate || new Date().toISOString(),
        dateModified: post.updatedAt || post.publishDate || new Date().toISOString(),
        author: {
          name: post.author || 'Joshua Sevy',
          url: base,
        },
      });
    });
  }

  ngOnInit(): void {
    const initial = this.route.snapshot.paramMap.get('slug');
    if (initial && /^\d+$/.test(initial)) {
      this.blogStore
        .fetchPostById(initial)
        .pipe(take(1))
        .subscribe((p) => {
          if (p) {
            void this.router.navigate(['/blog', p.slug], { replaceUrl: true });
          } else {
            void this.router.navigate(['/blog']);
          }
        });
    }

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pm) => {
      const raw = pm.get('slug');
      if (!raw) {
        this.blogStore.requestPostBySlug(null);
        return;
      }
      if (/^\d+$/.test(raw)) {
        return;
      }
      this.blogStore.requestPostBySlug(raw);
    });
  }
}

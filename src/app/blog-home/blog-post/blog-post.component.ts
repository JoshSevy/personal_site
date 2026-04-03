import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../blog-post.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NEVER, Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { MarkdownToHtmlPipe } from '../../pipes/markdown-to-html.pipe';
import { HighlightCodeDirective } from '../../directives/highlight-syntax.directive';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [AsyncPipe, DatePipe, MarkdownToHtmlPipe, HighlightCodeDirective, RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
})
export class BlogPostComponent implements OnInit {
  post$: Observable<BlogPost | null | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    const initial = this.route.snapshot.paramMap.get('slug');
    if (initial && /^\d+$/.test(initial)) {
      this.blogService
        .getPostById(initial)
        .pipe(take(1))
        .subscribe((p) => {
          if (p) {
            void this.router.navigate(['/blog', p.slug], { replaceUrl: true });
          } else {
            void this.router.navigate(['/blog']);
          }
        });
    }

    this.post$ = this.route.paramMap.pipe(
      switchMap((pm) => {
        const raw = pm.get('slug');
        if (!raw) {
          return of(null);
        }
        if (/^\d+$/.test(raw)) {
          return NEVER;
        }
        return this.blogService.getPostBySlug(raw);
      }),
      tap((post) => {
        if (post) {
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
        }
      })
    );
  }
}
